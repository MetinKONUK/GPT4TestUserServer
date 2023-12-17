const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        userEmailAddress: {
            type: String,
            required: true,
        },
    },
    { versionKey: false, collection: 'UsersCollection' }
);

const User = mongoose.model('UsersCollection', UserSchema);
module.exports = User;
