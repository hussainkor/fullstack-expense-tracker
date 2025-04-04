import express from "express"

import userRoute from "./user.js"
import authRoute from "./auth.js"

const router = express.Router()

router.use(userRoute)
router.use(authRoute)
// router.use(accountRoute)
// router.use(transactionRoute)

export default router