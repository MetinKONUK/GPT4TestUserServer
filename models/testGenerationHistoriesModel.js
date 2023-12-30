const mongoose = require('mongoose')
const ModelSettingsSchema = require('./modelSettingsModel').schema // Adjust the path accordingly

const testGenerationHistorySchema = new mongoose.Schema({
    dateTimestamp: { type: Date, default: Date.now },
    focalCode: { type: String, default: '' },
    testCode: { type: String, default: '' },
    isExecuted: { type: Boolean, default: false },
    executionResults: { type: String, default: '' },
    modelSettings: { type: ModelSettingsSchema, default: () => ({}) },
})

const TestGenerationHistoriesSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        testGenerationHistories: {
            type: [testGenerationHistorySchema],
            default: [],
        },
    },
    { versionKey: false, collection: 'TestGenerationHistories' }
)

const TestGenerationHistories = mongoose.model(
    'TestGenerationHistories',
    TestGenerationHistoriesSchema
)

module.exports = TestGenerationHistories
