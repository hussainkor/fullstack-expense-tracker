import express from "express"

import { checkAuth } from "../middleware/auth.middleware.js";
import { pool } from "../config/db.config.js";
import { getMonthName } from "../libs/index.js";

const transactionRoute = express.Router()

transactionRoute.get("/getTransactions", checkAuth, async (req, res) => {
    try {
        const today = new Date()
        const _savenDaysAgo = new Date(today)
        _savenDaysAgo.setDate(today.getDate() - 7)

        const sevenDaysAgo = _savenDaysAgo.toISOString().split("|")[0]

        const { df, dt, s } = req.query

        const { userId } = req.body.user

        const startDate = new Date(df || sevenDaysAgo)
        const endDate = new Date(dt || new Date())

        const transactions = await pool.query(`SELECT * FROM tbltransaction WHERE user_id = $1 
            AND createdat BETWEEN $2 AND $3 
            AND (description 
            ILIKE '%' || $4 || '%' 
            OR status ILIKE '%' || $4 || '%' 
            OR source ILIKE '%' || $4 || '%') 
            ORDER by id DESC`,
            [userId, startDate, endDate, s])

        res.status(201).json(
            {
                status: "success",
                data: transactions.rows
            }
        )

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "Something went wrong", message: error.message })
    }
})

transactionRoute.get("/dashboard", checkAuth, async (req, res) => {
    try {

        const { userId } = req.body.user

        let totalIncome = 0
        let totalExpense = 0

        const transactionResult = await pool.query(`SELECT type, 
            SUM(amount) AS totalAmount FROM tbltransaction 
            WHERE user_id = $1 GROUP BY type`, [userId])

        const transactions = transactionResult.rows

        transactions.forEach((transaction) => {
            if (transaction.type === "income") {
                totalIncome += transaction.totalamount
            }
            else {
                totalExpense += transaction.totalamount
            }
        })

        const availableBalance = totalIncome - totalExpense

        const year = new Date().getFullYear()
        const start_date = new Date(year, 0, 1)
        const end_date = new Date(year, 11, 31, 23, 59, 59)

        const result = await pool.query(`SELECT 
            EXTRACT(MONTH FROM createdat) AS month,
            type,
            SUM(amount) AS totalAmount
            FROM tbltransaction
            WHERE user_id = $1
            AND createdat BETWEEN $2 AND $3
            GROUP BY 
            EXTRACT(MONTH FROM createdat), type
            `, [userId, start_date, end_date])

        const data = new Array(12).fill().map((_, index) => {
            const monthData = result.rows.filter((item) => parseInt(item.month) === index + 1)

            const income = monthData.find((item) => item.type === "income")?.totalamount || 0
            const expense = monthData.find((item) => item.type === "expense")?.totalamount || 0

            return {
                label: getMonthName(index),
                income,
                expense
            }
        })

        // Fetch last transactions
        const lastTransactionsResults = await pool.query(`
            SELECT * FROM tbltransaction WHERE user_id = $1 ORDER BY createdat DESC LIMIT 5
            `, [userId])

        const lastTransactions = lastTransactionsResults.rows

        // Fetch last accounts
        const lastAccountResults = await pool.query(`            
            SELECT * FROM tblaccount WHERE user_id = $1 ORDER BY createdat DESC LIMIT 4
            `, [userId])

        const lastAccount = lastAccountResults.rows

        res.status(200).json(
            {
                status: "success",
                availableBalance,
                totalIncome,
                totalExpense,
                lastTransactions,
                lastAccount,
                chartData: data,
            }
        )

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "Something went wrong", message: error.message })
    }
})

transactionRoute.post("/addTransaction/:account_id", checkAuth, async (req, res) => {
    try {
        const { userId } = req.body.user
        const { account_id } = req.params
        const { description, source, amount } = req.body

        if (!(description || source || amount)) {
            return res.status(403).json(
                {
                    status: "failed",
                    message: "Provide required fields"
                }
            )
        }

        if (Number(amount) <= 0) {
            return res.status(403).json(
                {
                    status: "failed",
                    message: "Amount should be greater than 0"
                }
            )
        }

        const result = await pool.query("SELECT * from tblaccount WHERE id = $1", [account_id])
        const accountInfo = result.rows[0]

        if (!accountInfo) {
            return res.status(403).json(
                {
                    status: "failed",
                    message: "Invalid account information"
                }
            )
        }

        if (accountInfo.account_balance <= 0 || accountInfo.account_balance < Number(amount)) {
            return res.status(403).json(
                {
                    status: "failed",
                    message: "Transaction failed! Insufficient account balance"
                }
            )
        }

        await pool.query("BEGIN")

        await pool.query(`UPDATE tblaccount 
            SET account_balance = account_balance - $1, 
            updatedat = CURRENT_TIMESTAMP WHERE id = $2`,
            [amount, account_id])

        await pool.query(`INSERT INTO tbltransaction
            (user_id, description, type, status, amount, source) 
            VALUES($1, $2, $3, $4, $5, $6)`,
            [userId, description, "expense", "Completed", amount, source])

        await pool.query("COMMIT")

        res.status(200).json(
            {
                status: "success",
                message: "Transaction completed successfully"
            }
        )

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "Something went wrong", message: error.message })
    }
})

transactionRoute.put("/transfer-money", checkAuth, async (req, res) => {
    try {
        const { userId } = req.body.user
        const { from_account, to_account, amount } = req.body

        if (!(from_account || to_account || amount)) {
            return res.status(403).json(
                {
                    status: "failed",
                    message: "Provide required fields"
                }
            )
        }

        const newAmount = Number(amount)

        if (newAmount <= 0) {
            return res.status(403).json(
                {
                    status: "failed",
                    message: "Amount should be greater than 0"
                }
            )
        }

        const fromAccountResult = await pool.query("SELECT * from tblaccount WHERE id = $1", [from_account])
        const fromAccount = fromAccountResult.rows[0]

        if (!fromAccount) {
            return res.status(403).json(
                {
                    status: "failed",
                    message: "Account information not found"
                }
            )
        }

        if (newAmount > fromAccount.account_balance) {
            return res.status(403).json(
                {
                    status: "failed",
                    message: "Transfer failed, Insufficient account balance"
                }
            )
        }

        // BEGIN TRANSACTION
        await pool.query("BEGIN")

        await pool.query(`UPDATE tblaccount 
            SET account_balance = account_balance - $1, 
            updatedat = CURRENT_TIMESTAMP WHERE id = $2`, [newAmount, from_account])

        const toAccountResult = await pool.query(`UPDATE tblaccount 
            SET account_balance = account_balance + $1,
            updatedat = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`, [newAmount, to_account])

        const toAccount = toAccountResult.rows[0]

        const description = `Transfer (${fromAccount?.account_name} - ${toAccount?.account_name})`

        await pool.query(`INSERT into tbltransaction
            (user_id, description, type, status, amount, source) 
            VALUES($1, $2, $3, $4, $5, $6)`,
            [userId, description, "expense", "Completed", amount, fromAccount?.account_name])

        const description1 = `Received (${fromAccount?.account_name} - ${toAccount?.account_name})`

        await pool.query(`INSERT INTO tbltransaction 
            (user_id, description, type, status, amount, source) 
            VALUES($1, $2, $3, $4, $5, $6)`,
            [userId, description1, "income", "Completed", amount, toAccount?.account_name]
        )

        await pool.query("COMMIT")

        res.status(200).json(
            {
                status: "success",
                message: "Transaction completed successfully"
            }
        )

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "Something went wrong", message: error.message })
    }
})

export default transactionRoute