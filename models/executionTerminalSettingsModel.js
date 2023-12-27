// ExecutionTerminalSettings.js
const mongoose = require('mongoose')

const ThemeSchema = new mongoose.Schema(
    {
        themeBGColor: String,
        themeToolbarColor: String,
        themeColor: String,
        themePromptColor: String,
    },
    { _id: false }
)

const ExecutionTerminalSettingsSchema = new mongoose.Schema(
    {
        themes: {
            type: Map,
            of: ThemeSchema,
            default: {
                light: {
                    themeBGColor: '#f5f5f5',
                    themeToolbarColor: '#eeeeee',
                    themeColor: '#212121',
                    themePromptColor: '#00e676',
                },
                dark: {
                    themeBGColor: '#757575',
                    themeToolbarColor: '#424242',
                    themeColor: '#fafafa',
                    themePromptColor: '##e0e0e0',
                },
            },
        },
        selectedThemeName: { type: String, default: 'light' },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { versionKey: false, collection: 'ExecutionTerminalSettingsCollection' }
)

const ExecutionTerminalSettings = mongoose.model(
    'ExecutionTerminalSettings',
    ExecutionTerminalSettingsSchema
)
module.exports = ExecutionTerminalSettings
