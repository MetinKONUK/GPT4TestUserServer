const express = require('express')
const userModel = require('../models/userModel')
const ModelSettingsModel = require('../models/modelSettingsModel')
const router = express.Router()

// Update model settings
// Update model settings
router.post('/updateModelSettings', async (req, res) => {
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

        // Assuming you have a separate ModelSettingsModel
        await ModelSettingsModel.findByIdAndUpdate(
            user.modelSettingsId,
            settings
        )

        res.status(200).send({
            message: 'Model settings updated successfully',
        })
    } catch (error) {
        res.status(500).send({
            message: `Error updating model settings: ${error.message}`,
        })
    }
})

// Get model settings
// Get model settings
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

        // Assuming you have a separate ModelSettingsModel
        const modelSettings = await ModelSettingsModel.findById(
            user.modelSettingsId
        )

        res.status(200).send({
            modelSettings,
        })
    } catch (error) {
        res.status(500).send({
            message: `Error fetching model settings: ${error.message}`,
        })
    }
})

module.exports = router
