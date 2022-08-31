const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    time: {
        type: Number
    },
    inc: {
        type: Number
    },
    toStart: {
        type: String
    }
})

module.exports = mongoose.model('Game', gameSchema)