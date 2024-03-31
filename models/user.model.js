const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    username: {
        type: Schema.Types.String,
        required:true,
        unique:true
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
    isVerified: {
        type: Schema.Types.Boolean,
        default: false
    }
}, { timestamps: true });

const User = mongoose.model('user', userSchema)

module.exports = User
