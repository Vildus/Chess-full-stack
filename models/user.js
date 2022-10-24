const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    elo: {
        type: Number,
        required: true,
        default: 1000
    }
})

module.exports = mongoose.model('User', userSchema)