const express = require('express')
const bcrypt = require('bcrypt')
const UserModel = require('../models/userModel') // Adjust the path as needed

// Import additional models
const InputEditorSettingsModel = require('../models/inputEditorSettingsModel')
const OutputEditorSettingsModel = require('../models/outputEditorSettingsModel')
const ExecutionTerminalSettingsModel = require('../models/executionTerminalSettingsModel')
const SpecialCommandTerminalSettingsModel = require('../models/specialCommandTerminalSettingsModel')
const ModelSettingsModel = require('../models/modelSettingsModel')

const router = express.Router()

router.post('/updateUserCredentials', async (req, res) => {
    try {
        let {
            userIdentifier,
            newUsername,
            newEmailAddress,
            authenticationPassword,
        } = req.body

        const existingUser = await UserModel.findOne({
            $or: [
                { username: newUsername },
                { userEmailAddress: newEmailAddress },
            ],
        })
        if (existingUser) {
            // Check if the existing user is the same as the user making the request
            if (
                existingUser.username === userIdentifier ||
                existingUser.userEmailAddress === userIdentifier
            ) {
                // If it's the same user, continue with the update
                console.log('Same user updating')
            } else {
                // If it's a different user, return an error
                console.log('user exists')
                return res.status(200).send({
                    type: 'error',
                    message: 'Username or email already exists.',
                })
            }
        }

        // Find the user by username or email
        const user = await UserModel.findOne({
            $or: [
                { username: userIdentifier },
                { userEmailAddress: userIdentifier },
            ],
        })

        if (!user) {
            return res.status(200).send({
                type: 'error',
                message: 'User not found',
            })
        }

        // Check if authentication password matches user password
        bcrypt.compare(
            authenticationPassword,
            user.userPassword,
            async (err, isMatch) => {
                if (err) {
                    console.log('Error in bcrypt comparison:', err)
                    return res.status(200).send({
                        type: 'error',
                        message: 'Error validating authentication credentials',
                    })
                }

                if (!isMatch) {
                    console.log('invalid password')
                    return res.status(200).send({
                        type: 'error',
                        message: 'Invalid authentication password',
                    })
                }

                // Authentication successful, update user credentials
                if (newUsername) {
                    user.username = newUsername
                }
                if (newEmailAddress) {
                    user.userEmailAddress = newEmailAddress
                }
                await user.save()

                res.status(200).send({
                    type: 'success',
                    message: 'User credentials updated successfully',
                })
            }
        )
    } catch (error) {
        console.log('Server error:', error)
        res.status(200).send({
            type: 'error',
            message: `Server error: ${error.message}`,
        })
    }
})

// User registration
router.post('/register', async (req, res) => {
    try {
        const { username, userEmailAddress, userPassword } = req.body

        // Check for existing user
        const existingUser = await UserModel.findOne({
            $or: [{ username }, { userEmailAddress }],
        })

        if (existingUser) {
            return res.status(400).send({
                type: 'error',
                message: 'Username or email already exists.',
            })
        }

        // Create new user without hashing password here
        const newUser = new UserModel({
            username,
            userEmailAddress,
            userPassword, // Password will be hashed in pre-save hook
        })

        await newUser.save()

        // Create related documents with the new user's ID
        const inputEditorSettings = new InputEditorSettingsModel({
            userId: newUser._id,
        })
        const outputEditorSettings = new OutputEditorSettingsModel({
            userId: newUser._id,
        })
        const executionTerminalSettings = new ExecutionTerminalSettingsModel({
            userId: newUser._id,
        })
        const specialCommandTerminalSettings =
            new SpecialCommandTerminalSettingsModel({ userId: newUser._id })
        const modelSettings = new ModelSettingsModel({ userId: newUser._id })

        // Save related documents
        await Promise.all([
            inputEditorSettings.save(),
            outputEditorSettings.save(),
            executionTerminalSettings.save(),
            specialCommandTerminalSettings.save(),
            modelSettings.save(),
        ])

        // Update the User document with the IDs of the settings documents
        newUser.inputEditorSettingsId = inputEditorSettings._id
        newUser.outputEditorSettingsId = outputEditorSettings._id
        newUser.executionTerminalSettingsId = executionTerminalSettings._id
        newUser.specialCommandTerminalSettingsId =
            specialCommandTerminalSettings._id
        newUser.modelSettingsId = modelSettings._id
        await newUser.save()

        res.status(201).send({
            type: 'success',
            message: 'User registered successfully',
        })
    } catch (error) {
        res.status(500).send({
            type: 'error',
            message: `Server error: ${error.message}`,
        })
    }
})

// Existing imports and setup...

// User login
router.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body // 'identifier' can be either username or email

        console.log('Login Attempt:', identifier, password)

        // Find user by username or email
        const user = await UserModel.findOne({
            $or: [{ username: identifier }, { userEmailAddress: identifier }],
        })

        if (!user) {
            console.log('User not found')
            return res
                .status(400)
                .send({ type: 'error', message: 'User not found' })
        }

        // Check if password matches
        bcrypt.compare(password, user.userPassword, (err, isMatch) => {
            if (err) {
                console.log('Error in bcrypt comparison:', err)
                return res.status(500).send({
                    type: 'error',
                    message: 'Error validating credentials',
                })
            }
            if (!isMatch) {
                console.log('Invalid credentials')
                return res
                    .status(400)
                    .send({ type: 'error', message: 'Invalid credentials' })
            }

            // Login successful
            res.status(200).send({
                type: 'success',
                message: 'Logged in successfully',
                username: user.username,
                email: user.userEmailAddress,
            })
        })
    } catch (error) {
        console.log('Server error:', error)
        res.status(500).send({
            type: 'error',
            message: `Server error: ${error.message}`,
        })
    }
})

// Existing module exports...

module.exports = router
