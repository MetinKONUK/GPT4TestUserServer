const express = require('express')
const userModel = require('../models/userModel')
const InputEditorSettingsModel = require('../models/inputEditorSettingsModel')
const OutputEditorSettingsModel = require('../models/outputEditorSettingsModel')

const router = express.Router()

// Update editor settings
router.post('/updateEditorSettings', async (req, res) => {
    try {
        const { userIdentifier, settings, type } = req.body
        const user = await userModel.findOne({
            $or: [
                { username: userIdentifier },
                { userEmailAddress: userIdentifier },
            ],
        })

        if (!user) {
            return res.status(404).send({ message: 'User not found' })
        }

        if (type === 'input') {
            await InputEditorSettingsModel.findByIdAndUpdate(
                user.inputEditorSettingsId,
                settings
            )
        } else if (type === 'output') {
            await OutputEditorSettingsModel.findByIdAndUpdate(
                user.outputEditorSettingsId,
                settings
            )
        }

        res.status(200).send({
            message: 'Editor settings updated successfully',
        })
    } catch (error) {
        res.status(500).send({
            message: `Error updating editor settings: ${error.message}`,
        })
    }
})

// Get editor settings
// Get editor settings
router.get('/getEditorSettings/:userIdentifier', async (req, res) => {
    try {
        const userIdentifier = req.params.userIdentifier
        const user = await userModel
            .findOne({
                $or: [
                    { username: userIdentifier },
                    { userEmailAddress: userIdentifier },
                ],
            })
            .populate({
                path: 'inputEditorSettingsId',
                select: '-_id -userId', // Exclude the _id and userId fields
            })
            .populate({
                path: 'outputEditorSettingsId',
                select: '-_id -userId', // Exclude the _id and userId fields
            })

        if (!user) {
            return res.status(404).send({ message: 'User not found' })
        }

        res.status(200).send({
            inputEditorSettings: user.inputEditorSettingsId,
            outputEditorSettings: user.outputEditorSettingsId,
        })
    } catch (error) {
        res.status(500).send({
            message: `Error fetching editor settings: ${error.message}`,
        })
    }
})

module.exports = router
