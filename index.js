const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const logger = require('./logger')

// Import routes
const userActionsRecap = require('./routes/userActionsRecapRoutes')
const testGenerationHistories = require('./routes/testGenerationHistoriesRoutes')
const editorSettingsRoutes = require('./routes/editorSettingsRoutes')
const modelSettingsRoutes = require('./routes/modelSettingsRoutes')
const executionTerminalSettingsRoutes = require('./routes/executionTerminalSettingsRoutes')
const specialCommandTerminalSettingsRoutes = require('./routes/specialCommandTerminalSettingsRoutes')
const authRoutes = require('./routes/authRoutes')

dotenv.config()
const { SERVER_PORT, CLIENT_URL, DATABASE_URI } = process.env

mongoose.set('strictQuery', false)
mongoose.connect(DATABASE_URI)
const db = mongoose.connection

const server = express()
server.use(express.json())
server.use(
    cors({
        origin: '*',
        credentials: true,
        optionSuccessStatus: 200,
    })
)

// Use routes
server.use('/api/users/userActionsRecap', userActionsRecap)
server.use('/api/users/testGenerationHistories', testGenerationHistories)
server.use('/api/users/editorSettings', editorSettingsRoutes)
server.use('/api/users/modelSettings', modelSettingsRoutes)
server.use(
    '/api/users/executionTerminalSettings',
    executionTerminalSettingsRoutes
)
server.use(
    '/api/users/specialCommandTerminalSettings',
    specialCommandTerminalSettingsRoutes
)
server.use('/api/auth', authRoutes)

db.on('error', error => {
    logger.error(`DB connection error, message: ${error.message}`)
})

db.once('open', () => {
    logger.info(`connected to DB: ${DATABASE_URI}`)
})

server.listen(SERVER_PORT, () => {
    console.log(`server started, PORT=${SERVER_PORT}`)
    logger.info(`server started, PORT=${SERVER_PORT}`)
})
