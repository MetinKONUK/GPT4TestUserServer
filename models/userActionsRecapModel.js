const mongoose = require('mongoose')

const UserActionsRecapSchema = new mongoose.Schema(
    {
        unitTestGenerationSuccessCount: { type: Number, default: 0 },
        unitTestGenerationFailureCount: { type: Number, default: 0 },
        unitTestExecutionSuccessCount: { type: Number, default: 0 },
        unitTestExecutionFailureCount: { type: Number, default: 0 },
    },

    { versionKey: false, collection: 'UserActionsRecapCollections' }
)

const UserActionsRecap = mongoose.model(
    'UserActionsRecap',
    UserActionsRecapSchema
)

module.exports = UserActionsRecap
