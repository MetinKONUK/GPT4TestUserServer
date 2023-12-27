const express = require('express')
const userModel = require('../models/userModel')
const SpecialCommandTerminalSettingsModel = require('../models/specialCommandTerminalSettingsModel')
const router = express.Router()

// Fetch special command terminal settings
// Fetch special command terminal settings
router.get(
    '/getSpecialCommandTerminalSettings/:userIdentifier',
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

            // Assuming you have a separate SpecialCommandTerminalSettingsModel
            const specialCommandTerminalSettings =
                await SpecialCommandTerminalSettingsModel.findById(
                    user.specialCommandTerminalSettingsId
                )

            res.status(200).send({
                specialCommandTerminalSettings,
            })
        } catch (error) {
            res.status(500).send({
                message: `Error fetching special command terminal settings: ${error.message}`,
            })
        }
    }
)

// Update special command terminal settings
// Update special command terminal settings
router.post('/updateSpecialCommandTerminalSettings', async (req, res) => {
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

        // Assuming you have a separate SpecialCommandTerminalSettingsModel
        await SpecialCommandTerminalSettingsModel.findByIdAndUpdate(
            user.specialCommandTerminalSettingsId,
            settings
        )

        res.status(200).send({
            message: 'Special command terminal settings updated successfully',
        })
    } catch (error) {
        res.status(500).send({
            message: `Error updating special command terminal settings: ${error.message}`,
        })
    }
})

module.exports = router
