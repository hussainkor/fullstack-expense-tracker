import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import userRoute from "./routes/user.js"
import authRoute from "./routes/auth.js"
import accountRoute from "./routes/account.js"
import transactionRoute from "./routes/transaction.js"

const app = express()

dotenv.config()
const port = process.env.PORT || 8000

app.use(cors())
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

app.use("/api", userRoute)
app.use("/api", authRoute)
app.use("/api", accountRoute)
app.use("/api", transactionRoute)

app.use("*", (req, res) => {
    return res.status(404).json({ message: "Url not found" })
})

app.listen(port, () => {
    console.log(`Server is running on the port ${port}`);
})