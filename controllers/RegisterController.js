const express = require('express')
const router = express.Router()

const User = require('../models/user')

router.post('/register', async (req, res) => {
    const post = req.body
    if (!(post.name || post.password || post.passwordChec)) {
        res.send({
            message: "Invalid"
        })
        return
    }
    if (post.password != post.passwordChec) {
        res.send({
            message: "Passwords don't match"
        })
        return
    }
    if (post.name.length < 5) {
        res.send({
            message: "Username too short"
        })
        return
    }
    const user = new User({
        name: post.name,
        password: post.password,
        elo: 1000,
        token: crypto.randomBytes(64).toString('hex')
    })
    try {
        await user.save()
        console.log("Registered user " + post.name)
        res.send({
            message: 'Registered'
        })
    } catch (err) {
        if (err.message.includes("duplicate")) {
            res.send({
                message: 'User exists'
            })
            return
        }
        res.send({
            message: 'Error with database'
        })
        console.log(err.message)
    }
})

module.exports = router