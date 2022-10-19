const express = require('express')
const router = express.Router()

const User = require('../models/user')

router.post('/login', async (req, res) => {
    if (req.body.token) {
        const user = await User.findOne({token: req.body.token})
        if (user) {
            res.send({login: true, token: user.token, name: user.name})
        } else {
            res.send({login: false})
        }
        return
    }
    const user = await User.findOne({$and: [{name: req.body.name},{password: req.body.password}]})
    if (user) {
        res.send({login: true, token: user.token, name: user.name}) 
    } else {
        res.send({login: false}) 
    }  
})

module.exports = router