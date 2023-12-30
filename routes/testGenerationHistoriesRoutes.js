const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/userModel')
const TestGenerationHistories = require('../models/testGenerationHistoriesModel')

const router = express.Router()

router.post('/saveTestExecutionResults', async (req, res) => {
    try {
        const {
            testGenerationHistoryId,
            currentTestGenerationElementId,
            executionResults,
        } = req.body

        const result = await TestGenerationHistories.updateOne(
            {
                _id: new mongoose.Types.ObjectId(testGenerationHistoryId),
                'testGenerationHistories._id': new mongoose.Types.ObjectId(
                    currentTestGenerationElementId
                ),
            },
            {
                $set: {
                    'testGenerationHistories.$.executionResults':
                        executionResults,
                    'testGenerationHistories.$.isExecuted': true,
                },
            }
        )

        if (result.nModified === 0) {
            throw new Error('No document was updated')
        }

        res.status(200).send({
            message: 'Test execution results saved successfully',
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).send({
            message: `Error saving test execution results: ${error.message}`,
        })
    }
})

router.post('/saveTestGenerationResults', async (req, res) => {
    try {
        const {
            userIdentifier,
            dateTimestamp,
            focalCode,
            testCode,
            testGenerationHistoryId,
            modelSettings, // Added this line
        } = req.body
        const user = await User.findOne({
            $or: [
                { username: userIdentifier },
                { userEmailAddress: userIdentifier },
            ],
        })

        if (!user) {
            return res.status(404).send({ message: 'User not found' })
        }

        let savedDocument
        let newElementId

        if (testGenerationHistoryId) {
            const testEntry = {
                _id: new mongoose.Types.ObjectId(),
                dateTimestamp,
                focalCode,
                testCode,
                modelSettings, // Include model settings here
            }
            savedDocument = await TestGenerationHistories.findByIdAndUpdate(
                testGenerationHistoryId,
                { $push: { testGenerationHistories: testEntry } },
                { new: true, upsert: true }
            )
            newElementId = testEntry._id
        } else {
            const newTestGenerationHistory = new TestGenerationHistories({
                userId: user._id,
                testGenerationHistories: [
                    { dateTimestamp, focalCode, testCode, modelSettings }, // Include model settings here
                ],
            })
            savedDocument = await newTestGenerationHistory.save()
            user.testGenerationHistoryId = savedDocument._id
            await user.save()
            newElementId = savedDocument.testGenerationHistories[0]._id
        }

        res.status(200).send({
            message: 'Test generation results saved successfully',
            testGenerationHistoryId: savedDocument._id,
            currentTestGenerationElementId: newElementId,
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).send({
            message: `Error saving test generation results: ${error.message}`,
        })
    }
})

router.get(
    '/getTestGenerationHistories/:userIdentifier/:historyElementCount',
    async (req, res) => {
        console.log(req.body)
        try {
            const { userIdentifier, historyElementCount } = req.params
            const user = await User.findOne({
                $or: [{ username: userIdentifier }, { email: userIdentifier }],
            })
            console.log(user)
            if (!user) {
                return res.status(404).send('User not found')
            }

            // Then, find the test generation histories for this user
            const histories = await TestGenerationHistories.find({
                userId: user._id,
            }).select({
                testGenerationHistories: { $slice: -historyElementCount },
            })
            console.log(histories)
            res.json(histories)
        } catch (error) {
            console.log(error.message)
            res.status(500).send(error.message)
        }
    }
)

module.exports = router
