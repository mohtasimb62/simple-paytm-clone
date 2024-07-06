const express = require("express")
const zod = require("zod")
const { User, Account } = require("../db")
const { JWT_SECRET } = require("../config")
const jwt = require("jsonwebtoken")
const { authMiddleware } = require("../middleware")

const router = express.Router()

const signupSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
})

const signinSchema = zod.object({
    username: zod.string(),
    password: zod.string()
})

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
})

router.post("/signup", async (req, res) => {
    const { success } = signupSchema.safeParse(req.body)

    if (!success) {
        return res.status(411).json({message: "Email already taken / Incorrect inputs"})
    }

    const userExists = await User.findOne({
        username: req.body.username
    })

    if(userExists) {
        return res.status(411).json({message: "Email already taken / Incorrect inputs"})   
    }

    const newUser = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    })

    const newUserId = newUser._id

    await Account.create({
        newUserId,
        balance: 1 + Math.random() * 10000
    })

    const newUserToken = jwt.sign({
        newUserId
    }, JWT_SECRET)

    res.status(200).json({
        message: "User created successfully",
	    token: newUserToken
    })
})

router.post("/signin", async (req, res) => {
    const { success } = signinSchema.safeParse(req.body)

    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username,
        password: req.body.password
    })

    if (existingUser) {
        const token = jwt.sign({
            userId: existingUser._id
        }, JWT_SECRET)

        res.json({
            token: token
        })

        return
    }

    res.status(411).json({
        message: "Error while logging in"
    })
})

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)

    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne({
        _id: req.userId
    }, req.body)

    res.json({
        message: "Updated successfuly"
    })
})


router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || ""

    const users = User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})


module.exports = router