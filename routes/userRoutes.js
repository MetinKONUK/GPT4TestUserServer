const express = require('express')
const bcrypt = require('bcrypt')
const userModel = require('../models/user')
const router = express.Router()

router.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body
        const user = await userModel.findOne({
            $or: [{ username: identifier }, { userEmailAddress: identifier }],
        })

        if (!user)
            return res
                .status(400)
                .send({ type: 'error', message: 'User not found' })

        const isMatch = await bcrypt.compare(password, user.userPassword)
        if (!isMatch)
            return res
                .status(400)
                .send({ type: 'error', message: 'Invalid credentials' })

        res.status(200).send({
            type: 'success',
            message: 'Logged in successfully',
            username: user.username,
            email: user.userEmailAddress,
        })
    } catch (error) {
        res.status(500).send({
            type: 'error',
            message: `Server error: ${error.message}`,
        })
    }
})

router.post('/register', async (req, res) => {
    try {
        const { username, userEmailAddress, userPassword } = req.body

        const existingUser = await userModel.findOne({
            $or: [{ username }, { userEmailAddress }],
        })
        if (existingUser) {
            return res.status(400).send({
                type: 'error',
                message: 'Username or email already exists.',
            })
        }
        const newUser = new userModel({
            username,
            userEmailAddress,
            userPassword,
        })
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

router.post('/updateModelSettings', async (req, res) => {
    const { userIdentifier, settings } = req.body
    console.log(userIdentifier)
    try {
        // Find user by username or email and update settings
        const user = await userModel.findOneAndUpdate(
            {
                $or: [
                    { username: userIdentifier },
                    { userEmailAddress: userIdentifier },
                ],
            },
            { $set: { modelSettings: settings } },
            { new: true, runValidators: true }
        )

        if (!user) {
            return res.status(404).send({ message: 'User not found' })
        }

        res.status(200).send({
            message: 'Model settings updated successfully',
            modelSettings: user.modelSettings,
        })
    } catch (error) {
        res.status(500).send({
            message: `Error updating model settings: ${error.message}`,
        })
    }
})

router.get('/getModelSettings/:userIdentifier', async (req, res) => {
    try {
        const userIdentifier = req.params.userIdentifier
        const user = await userModel.findOne({
            $or: [
                { username: userIdentifier },
                { userEmailAddress: userIdentifier },
            ],
        })

        if (!user) {
            return res.status(404).send({ message: 'User not found' })
        }

        res.status(200).send({ settings: user.modelSettings })
    } catch (error) {
        res.status(500).send({
            message: `Error fetching model settings: ${error.message}`,
        })
    }
})

module.exports = router
