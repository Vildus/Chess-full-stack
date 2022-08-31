const mongoose = require('mongoose')

const activeSchema = new mongoose.Schema({
    state: {
        type: String,
        ref: "User",
        required: true
    },
    whiteTime: {
        type: Number
    },
    blackTime: {
        type: Number
    },
    inc: {
        type: Number
    },
    left: {
        type: String,
        default: ""
    },
    ended: {
        type: Boolean,
        default: false
    },
    white: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        name: {
            type: String
        },
        token: {
            type: String
        }
    },
    black: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        name: {
            type: String
        },
        token: {
            type: String
        }
    }
})

module.exports = mongoose.model('Active', activeSchema)