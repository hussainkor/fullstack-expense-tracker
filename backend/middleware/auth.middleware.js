import jwt from "jsonwebtoken"

export const checkAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) {
            return res.status(401).json({ message: "No token provided" })
        }
        const decodeUser = jwt.verify(token, process.env.JWT_SECRET)

        req.body.user = {
            userId: decodeUser.id
        }
        next()

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Soething went wrong", message: error.message })
    }
}

export const createJWT = (user) => {
    const token = jwt.sign(user, process.env.JWT_SECRET)
    return token
}
