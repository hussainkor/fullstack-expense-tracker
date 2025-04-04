import express from "express";
import { checkAuth } from "../middleware/auth.middleware.js";
import { pool } from "../config/db.config.js";
import { createJWT } from "../middleware/auth.middleware.js";

const accountRoute = express.Router()

accountRoute.get("/getAccount/:id", checkAuth, async (req, res) => {
    try {
        const { userId } = req.body.user;

        const accounts = await pool.query("SELECT * from tblaccount WHERE user_id = $1", [userId])

        if (accounts.rows.length === 0) {
            return res.status(401).json(
                {
                    status: "no account found"
                }
            )
        }

        res.status(200).json(
            {
                status: "success",
                data: accounts.rows
            }
        )

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "Something went wrong",
            message: error.message
        })
    }
})

accountRoute.post("/create/account", checkAuth, async (req, res) => {
    try {
        const { userId } = req.body.user
        const { name, amount, account_number } = req.body

        const accountExistResult = await pool.query("SELECT * from tblaccount WHERE account_name = $1 AND user_id = $2", [name, userId])

        const accountExist = accountExistResult.rows[0]

        if (accountExist) {
            return res.status(404).json({
                status: "failed",
                message: "Account already created"
            })
        }

        const createNewaccount = await pool.query("INSERT into tblaccount (user_id, account_name, account_balance, account_number) VALUES ($1, $2, $3, $4) RETURNING *", [userId, name, amount, account_number])

        const account = createNewaccount.rows[0]

        const userAccounts = Array.isArray(name) ? name : [name]
        await pool.query("UPDATE tbluser set account = array_cat(account, $1), updatedat = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *", [userAccounts, userId])

        const description = `${account.account_name} (Initial Deposit)`

        await pool.query("INSERT into tbltransaction (user_id, description, type, status, amount, source) VALUES($1, $2, $3, $4, $5, $6)", [userId, description, "income", "Completed", amount, account.account_name])


        const updatedUser = await pool.query("SELECT * from tbluser WHERE id = $1", [userId])
        const newUser = updatedUser.rows[0]
        const token = createJWT(newUser)
        newUser.password = undefined

        res.status(200).json(
            {
                status: 'success',
                message: `${account.account_name} account created successfully`,
                data: account,
                user: newUser,
                token: token
            }
        )

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "Something went wrong",
            message: error.message
        })
    }
})

accountRoute.post("/add/money/:id", checkAuth, async (req, res) => {
    try {
        const { userId } = req.body.user
        const { id } = req.params
        const { amount } = req.body

        const newAmount = Number(amount)

        const result = await pool.query("UPDATE tblaccount SET account_balance = (account_balance + $1) WHERE id = $2 RETURNING *", [newAmount, id])

        const accountInformation = result.rows[0]
        console.log(accountInformation);


        const description = `${accountInformation.account_name} (Deposit)`

        await pool.query("INSERT into tbltransaction(user_id, description, type, status, amount, source) VALUES($1, $2, $3, $4, $5, $6) RETURNING *", [userId, description, "income", "Completed", newAmount, accountInformation.account_name])

        res.status(201).json(
            {
                status: 'success',
                message: "Operation completed successfully",
                data: accountInformation
            }
        )

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "Something went wrong",
            message: error.message
        })
    }
})

export default accountRoute