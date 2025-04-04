import express from "express"
import bcrypt from "bcrypt"

import { pool } from "../config/db.config.js"
import { checkAuth, createJWT } from '../middleware/auth.middleware.js'

const userRoute = express.Router()

userRoute.get("/user", checkAuth, async (req, res) => {
    try {
        const { userId } = req.body.user
        const getUser = await pool.query('SELECT * FROM tbluser WHERE id = $1', [userId])

        const user = getUser.rows[0]
        if (!user) {
            return res.status(401).json({
                status: "failed",
                message: "No user found",
            })
        }
        user.password = undefined
        res.status(200).json({ user: user })

    } catch (error) {
        console.error('Error on fetching users:', error);
        res.status(500).send('Server error');
    }
})

userRoute.put("/changePassword", checkAuth, async (req, res) => {
    try {
        const { userId } = req.body.user
        const { currentPassword, newPassword, confirmNewPassword } = req.body

        const userExist = await pool.query("SELECT * from tbluser WHERE id = $1", [userId])

        const user = userExist.rows[0]

        if (!user) {
            return res.status(401).json({
                status: "failed",
                message: "No user found",
            })
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(401).json(
                {
                    status: "failed",
                    message: "New password and Confirm Password does not match"
                }
            )
        }

        const match = await bcrypt.compare(currentPassword, user?.password)

        if (!match) {
            return res.status(401).json({ message: "New password does not match" })
        }

        const hashPassword = await bcrypt.hash(newPassword, 10)

        await pool.query("update tbluser SET password = $1 WHERE id = $2", [hashPassword, userId])

        res.status(201).json(
            {
                statsu: 'success',
                message: "Password changed successfully"
            }
        )

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed", message: "Something went wrong" });
    }
})

userRoute.put("/updateUser", checkAuth, async (req, res) => {
    try {
        const { userId } = req.body.user;
        const { firstname, lastname, country, currency, contact } = req.body

        const userExist = await pool.query("SELECT * from tbluser WHERE id = $1", [userId])
        const user = userExist.rows[0]

        if (!user) {
            return res.status(401).json({
                status: "failed",
                message: "No user found",
            })
        }

        await pool.query("UPDATE tbluser SET firstname = $1, lastname = $2, country = $3, currency = $4, contact = $5, updatedat = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *", [firstname, lastname, country, currency, contact, userId])
        const token = createJWT(user)
        const updatedUser = await pool.query("SELECT * from tbluser WHERE id = $1", [userId])
        const newUser = updatedUser.rows[0]
        newUser.password = undefined
        res.status(201).json(
            {
                statsu: 'success',
                message: "User details updated successfully",
                user: newUser,
                token: token
            }
        )

    } catch (error) {
        console.error('Error on fetching user data:', error);
        res.status(500).send('Server error');
    }
})

export default userRoute