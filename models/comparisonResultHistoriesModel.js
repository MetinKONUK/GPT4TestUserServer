const mongoose = require('mongoose')

const comparisonResultHistorySchema = new mongoose.Schema({
    dateTimeStamp: { type: Date, default: Date.now },
    focalCode: { type: String, default: '' },
    toCompareList: [{ type: mongoose.Schema.Types.Mixed, default: [] }],
    comparisonResults: [{ type: mongoose.Schema.Types.Mixed, default: [] }],
})

const ComparisonResultHistoriesSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        comparisonResultsHistories: {
            type: [comparisonResultHistorySchema],
            default: [],
        },
    },
    { versionKey: false, collection: 'ComparisonResultHistories' }
)

const ComparisonResultsHistories = mongoose.model(
    'ComparisonResultHistories',
    ComparisonResultHistoriesSchema
)

module.exports = ComparisonResultsHistories
