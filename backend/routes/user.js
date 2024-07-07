const express = require("express")
const zod = require("zod")
const User = require("../db")
const account=require('../db')
const jwt = require("../config")
const router = express.Router();
const authMiddleware = require('../middleware')

const signupBody = zod.object({
    name: zod.string().emaill,
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.String()

})


const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

const updateBody = zod.object({
    username: zod.string().optional(),
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
})


router.post('/signup', async (req, res) => {
    const { success } = signupBody.safeParse(req.body);
    if (!success) {
        res.status(411).json({ msg: "Email already takrn/Invalid inputs" })
    }
    const existingUser = User.findOne({
        username: req.body.username
    })
    if (existingUser) {
        res.status(411).json({ mag: "Username Already taken" })
    }
    const user = await User.create({
        username: req.body.username,
        password: req.bosy.password,
        firstname: req.body.firstName,
        lastName: req.bosy.lastName
    })
    const userId = user._id;
    const jwtToken = jwt.sign({
        userId
    }, JWT_SECRET)
    await account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })


    res.json({
        mag: "User Created Succesfully",
        token: jwtToken
    })
})



router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

       
        res.json({
            token: token
        })
        return;
    }


    res.status(411).json({
        message: "Error while logging in"
    })
})


router.put('/update', authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body);
    if (!success) {
        res.status(411).json({ msg: "Bad Inputs" })
    }

    await User.updateOne({ _id: req.userId }, req.body);

    res.json({ msg: "User updated successfully" })
})

router.get('/bulk', async (req, res) => {
    const filter = req.query.filter || ""
    const user = await user.find[{
        $or: [{
            firstName: {
                "$regex": filter
            },
            lastName: {
                "$regex": filter
            }
        }]
    }]
    res.json({
        user: user.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })

})
module.exports=router