const express = require('express')
const UserModel = require('../models/userModel')
const UserActionsRecapModel = require('../models/userActionsRecapModel')

const router = express.Router()

router.post('/updateUserActionsRecap', async (req, res) => {
    try {
        const {
            unitTestGenerationSuccessCount,
            unitTestGenerationFailureCount,
            unitTestExecutionSuccessCount,
            unitTestExecutionFailureCount,
            userIdentifier,
        } = req.body

        const user = await UserModel.findOne({
            $or: [
                { username: userIdentifier },
                { userEmailAddress: userIdentifier },
            ],
        })

        if (!user) {
            return res.status(404).send('User not found')
        }

        let userActionsRecap = await UserActionsRecapModel.findById(
            user.userActionsRecapId
        )

        if (!userActionsRecap) {
            // Create a new UserActionsRecap document if it doesn't exist
            userActionsRecap = new UserActionsRecapModel({
                unitTestGenerationSuccessCount,
                unitTestGenerationFailureCount,
                unitTestExecutionSuccessCount,
                unitTestExecutionFailureCount,
            })
            await userActionsRecap.save()

            // Link the new document to the user
            user.userActionsRecapId = userActionsRecap._id
            await user.save()
        } else {
            // Update existing document
            await UserActionsRecapModel.findByIdAndUpdate(
                user.userActionsRecapId,
                {
                    unitTestGenerationSuccessCount,
                    unitTestGenerationFailureCount,
                    unitTestExecutionSuccessCount,
                    unitTestExecutionFailureCount,
                }
            )
        }

        res.status(200).send('User actions recap updated')
    } catch (error) {
        console.log(error.message)
        res.status(500).send(error.message)
    }
})

router.get('/getUserActionsRecap/:userIdentifier', async (req, res) => {
    try {
        const { userIdentifier } = req.params

        // Find the user by userIdentifier
        const user = await UserModel.findOne({
            $or: [
                { username: userIdentifier },
                { userEmailAddress: userIdentifier },
            ],
        })

        if (!user) {
            return res.status(404).send('User not found')
        }

        // Find the UserActionsRecap document using the ID from the user document
        const userActionsRecap = await UserActionsRecapModel.findById(
            user.userActionsRecapId
        )

        if (!userActionsRecap) {
            return res.status(404).send('User actions recap not found')
        }

        // Respond with the data from the userActionsRecap document
        res.status(200).json({
            unitTestGenerationSuccessCount:
                userActionsRecap.unitTestGenerationSuccessCount,
            unitTestGenerationFailureCount:
                userActionsRecap.unitTestGenerationFailureCount,
            unitTestExecutionSuccessCount:
                userActionsRecap.unitTestExecutionSuccessCount,
            unitTestExecutionFailureCount:
                userActionsRecap.unitTestExecutionFailureCount,
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).send(error.message)
    }
})

module.exports = router
