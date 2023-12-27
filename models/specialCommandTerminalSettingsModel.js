// SpecialCommandTerminalSettings.js
const mongoose = require('mongoose')

const SpecialThemeSchema = new mongoose.Schema(
    {
        themeBGColor: String,
        themeToolbarColor: String,
        themeColor: String,
        themePromptColor: String,
    },
    { _id: false }
)

const SpecialCommandTerminalSettingsSchema = new mongoose.Schema(
    {
        themes: {
            type: Map,
            of: SpecialThemeSchema,
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
        // Assuming each special command terminal settings is unique to a user
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        versionKey: false,
        collection: 'SpecialCommandTerminalSettingsCollection',
    }
)

const SpecialCommandTerminalSettings = mongoose.model(
    'SpecialCommandTerminalSettings',
    SpecialCommandTerminalSettingsSchema
)
module.exports = SpecialCommandTerminalSettings
