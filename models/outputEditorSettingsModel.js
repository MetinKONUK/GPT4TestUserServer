const mongoose = require('mongoose')

// OutputEditorSettings.js
const OutputEditorSettingsSchema = new mongoose.Schema(
    {
        fontSize: { type: Number, default: 20 },
        tabSize: { type: Number, default: 4 },
        readOnly: { type: Boolean, default: true },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { versionKey: false, collection: 'OutputEditorSettingsCollection' }
)

const OutputEditorSettings = mongoose.model(
    'OutputEditorSettings',
    OutputEditorSettingsSchema
)
module.exports = OutputEditorSettings
