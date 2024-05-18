const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/userModel')
const ComparisonResultHistories = require('../models/comparisonResultHistoriesModel')

const router = express.Router()

router.post('/saveComparisonResult', async (req, res) => {
    console.log('Request came to save comparison result!')
    try {
        const {
            userIdentifier,
            dateTimestamp,
            focalCode,
            toCompareList,
            comparisonResults,
        } = req.body
        const user = await User.findOne({
            $or: [
                { username: userIdentifier },
                { userEmailAddress: userIdentifier },
            ],
        })
        if (!user) {
            return res.status(404).send({ message: 'User not found!' })
        }

        let comparisonResultsHistories =
            await ComparisonResultHistories.findOne({ userId: user._id })
        if (!comparisonResultsHistories) {
            comparisonResultsHistories = new ComparisonResultHistories({
                userId: user._id,
                comparisonResultsHistories: [],
            })
        }

        const newComparisonResultHistory = {
            dateTimestamp: dateTimestamp || Date.now(),
            focalCode: focalCode || '',
            toCompareList: toCompareList || [],
            comparisonResults: comparisonResults || [],
        }

        comparisonResultsHistories.comparisonResultsHistories.push(
            newComparisonResultHistory
        )
        await comparisonResultsHistories.save()
        res.status(200).send({
            message: 'Comparison result saved successfully',
        })
    } catch (error) {
        console.error(error.message)
        res.status(500).send({
            message: `Error saving comparison results: ${error.message}`,
        })
    }
})

router.get('/getComparisonResultsHistory', async (req, res) => {
    try {
        const { userIdentifier } = req.query
        console.log(userIdentifier)
        const user = await User.findOne({
            $or: [
                { username: userIdentifier },
                { userEmailAddress: userIdentifier },
            ],
        })

        if (!user) {
            return res.status(404).send({ message: 'User not found!' })
        }

        const userComparisonResultsHistory =
            await ComparisonResultHistories.findOne({ userId: user._id })

        if (!userComparisonResultsHistory) {
            return res
                .status(404)
                .send({ message: 'Comparison results history not found!' })
        }

        userComparisonResultsHistory.comparisonResultsHistories.sort((a, b) => {
            return new Date(b.dateTimeStamp) - new Date(a.dateTimeStamp)
        })

        res.status(200).send(userComparisonResultsHistory)
    } catch (error) {
        console.error(error.message)
        res.status(500).send({
            message: `Error retrieving comparison results: ${error.message}`,
        })
    }
})

module.exports = router
