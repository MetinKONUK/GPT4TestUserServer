const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        userEmailAddress: {
            type: String,
            required: true,
            unique: true,
        },
        userPassword: {
            type: String,
            required: true,
        },
        modelSettings: {
            modelSelection: { type: String, default: '' },
            temperature: { type: Number, default: 0 },
            maxLength: { type: Number, default: 0 },
            stopSequences: { type: [String], default: [] },
            topP: { type: Number, default: 1 },
            frequencyPenalty: { type: Number, default: 0 },
            presencePenalty: { type: Number, default: 0 },
            // Add other settings as needed
        },
    },
    { versionKey: false, collection: 'UsersCollection' }
)

UserSchema.pre('save', function (next) {
    if (!this.isModified('userPassword')) {
        return next()
    }

    bcrypt.hash(this.userPassword, saltRounds, (err, hash) => {
        if (err) {
            return next(err)
        }
        this.userPassword = hash
        next()
    })
})

const User = mongoose.model('UsersCollection', UserSchema)
module.exports = User
