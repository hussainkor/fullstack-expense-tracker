import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import { pool } from '../config/db.config.js'
import { createJWT } from "../middleware/auth.middleware.js"
import { checkAuth } from "../middleware/auth.middleware.js"

const authRoute = express.Router()

authRoute.post("/signup", async (req, res) => {
    try {
        const { firstname, email, password, lastname, country, contact } = req.body

        const existingUser = await pool.query('SELECT * FROM tbluser WHERE email = $1', [email]);

        if (existingUser.rows.length > 0) {
            return res.status(401).json({ message: "Email already exist" })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const user = await pool.query({
            text: 'insert into tbluser(firstname, lastname, email, password, country, contact) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            values: [firstname, lastname, email, hashPassword, country, contact]
        })

        user.password = undefined;

        res.status(201).json(
            {
                status: "success",
                message: 'User account created successful',
                user: user.rows[0]
            }
        )
        const token = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: "1h" })
    } catch (error) {
        console.error('Error login:', error);
        res.status(500).json({ message: "something went wrong" })
    }
})

authRoute.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body

        const result = await pool.query('SELECT * FROM tbluser WHERE email = $1', [email])
        const user = result.rows[0]

        if (!user) {
            return res.status(401).json({ message: "Invalid email Id" })
        }

        const match = await bcrypt.compare(password, user.password)

        if (!match) {
            return res.status(401).json({ message: "Invalid password" })
        }
        else {
            const token = createJWT(user)
            user.password = undefined
            res.status(201).json({
                status: "success",
                message: "Login successful",
                user: user,
                token: token
            })
        }

    } catch (error) {
        console.error('Error login:', error);
        res.status(500).send('Server error');
    }
})

export default authRoute