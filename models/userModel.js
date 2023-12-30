// User.js
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        userEmailAddress: { type: String, required: true, unique: true },
        userPassword: { type: String, required: true },
        inputEditorSettingsId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'InputEditorSettings',
        },
        outputEditorSettingsId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'OutputEditorSettings',
        },
        executionTerminalSettingsId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ExecutionTerminalSettings',
        },
        specialCommandTerminalSettingsId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SpecialCommandTerminalSettings',
        },
        modelSettingsId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ModelSettings',
        },
        testGenerationHistoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TestGenerationHistories',
        },
        userActionsRecapId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserActionsRecap',
        },
    },
    { versionKey: false, collection: 'UsersCollection' }
)

UserSchema.pre('save', function (next) {
    if (!this.isModified('userPassword')) return next()
    bcrypt.hash(this.userPassword, saltRounds, (err, hash) => {
        if (err) return next(err)
        this.userPassword = hash
        next()
    })
})

const User = mongoose.model('User', UserSchema)
module.exports = User
