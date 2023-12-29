// ModelSettings.js
const mongoose = require('mongoose')

const ModelSettingsSchema = new mongoose.Schema(
    {
        modelSelection: { type: String, default: 'gpt-3.5-turbo-16k-0613' },
        temperature: { type: Number, default: 1.5 },
        maxLength: { type: Number, default: 4096 },
        stopSequences: { type: [String], default: [] },
        topP: { type: Number, default: 0.8 },
        frequencyPenalty: { type: Number, default: 1.5 },
        presencePenalty: { type: Number, default: 1.5 },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { versionKey: false, collection: 'ModelSettingsCollection' }
)

const ModelSettings = mongoose.model(
    'ModelSettingsCollection',
    ModelSettingsSchema
)
module.exports = ModelSettings
