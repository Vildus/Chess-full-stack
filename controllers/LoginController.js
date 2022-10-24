const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()

const User = require('../models/user')

router.post('/login', async (req, res) => {
    let user
    if (req.body.Atoken) {
        jwt.verify(req.body.Atoken, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
            if (err) res.send({login: false})
            user = await User.findById(payload.id)
            res.send({login: true, Atoken: req.body.Atoken, name: user.name})
        })
    } else {
        user = await User.findOne({$and: [{name: req.body.name},{password: req.body.password}]})
        if (user) {
            const Atoken = jwt.sign({id: user._id}, process.env.ACCESS_TOKEN_SECRET)
            res.send({login: true, Atoken: Atoken, name: user.name}) 
        } else {
            res.send({login: false}) 
        } 
    } 
})

module.exports = router