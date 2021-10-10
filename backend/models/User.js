const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: null
    },
    city: {
        type: String,
        default: null
    },
    company: {
        type: String,
        default: null
    },
    plan_id: {
        type: String,
        default: null
    },
    status: {
        type: String,
        default: 1
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    token: {
        type: String
    }
});
const User = mongoose.model('users', UserSchema);
module.exports = User;