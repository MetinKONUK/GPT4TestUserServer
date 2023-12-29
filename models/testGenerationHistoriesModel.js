const mongoose = require('mongoose')
const ModelSettingsSchema = require('./modelSettingsModel').schema // Adjust the path accordingly

const testGenerationHistorySchema = new mongoose.Schema({
    dateTimestamp: Date,
    focalCode: String,
    testCode: String,
    isExecuted: Boolean,
    executionResults: String,
    modelSettings: ModelSettingsSchema,
})

const TestGenerationHistoriesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    testGenerationHistories: [testGenerationHistorySchema],
})

const TestGenerationHistories = mongoose.model(
    'TestGenerationHistories',
    TestGenerationHistoriesSchema
)

module.exports = TestGenerationHistories
