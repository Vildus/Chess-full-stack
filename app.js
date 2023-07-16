const express = require("express")
const mongoose = require('mongoose')
const app = express()
const httpServer = require("http").createServer(app)
const bodyParser = require("body-parser")
const cors = require('cors')
global.io = require('socket.io')(httpServer, {cors : {origin: "*"}})

const PORT = 3000

const loginController = require('./controllers/LoginController')
const registerController = require('./controllers/RegisterController')
const socketController = require("./controllers/SocketContoller")

require('dotenv').config()

app.use(cors({origin:true,credentials: true}))
app.use(bodyParser.json())
app.use(express.static("client/dist"))

mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME
})
const db = mongoose.connection
db.on('error', (e) => {console.error(e)})
db.once('open', () => {console.log("Connected to MongoDB")})

//Routes
app.post('/api/register', registerController)
app.post('/api/login', loginController)

//Socket.io
io.on("connection", socketController)
httpServer.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})