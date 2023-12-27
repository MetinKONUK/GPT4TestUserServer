const express = require('express')
const userModel = require('../models/userModel')
const ExecutionTerminalSettingsModel = require('../models/executionTerminalSettingsModel')
const router = express.Router()

// Fetch execution terminal settings
// Fetch execution terminal settings
router.get(
    '/getExecutionTerminalSettings/:userIdentifier',
    async (req, res) => {
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

            // Assuming you have a separate ExecutionTerminalSettingsModel
            const executionTerminalSettings =
                await ExecutionTerminalSettingsModel.findById(
                    user.executionTerminalSettingsId
                )

            res.status(200).send({
                executionTerminalSettings,
            })
        } catch (error) {
            res.status(500).send({
                message: `Error fetching execution terminal settings: ${error.message}`,
            })
        }
    }
)

// Update execution terminal settings
// Update execution terminal settings
router.post('/updateExecutionTerminalSettings', async (req, res) => {
    const { userIdentifier, settings } = req.body
    try {
        const user = await userModel.findOne({
            $or: [
                { username: userIdentifier },
                { userEmailAddress: userIdentifier },
            ],
        })

        if (!user) {
            return res.status(404).send({ message: 'User not found' })
        }

        // Assuming you have a separate ExecutionTerminalSettingsModel
        await ExecutionTerminalSettingsModel.findByIdAndUpdate(
            user.executionTerminalSettingsId,
            settings
        )

        res.status(200).send({
            message: 'Execution terminal settings updated successfully',
        })
    } catch (error) {
        res.status(500).send({
            message: `Error updating execution terminal settings: ${error.message}`,
        })
    }
})

module.exports = router
