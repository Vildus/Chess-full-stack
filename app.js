const express = require("express")
const mongoose = require('mongoose')
const app = express()
const httpServer = require("http").createServer(app)
const bodyParser = require("body-parser")
const cors = require('cors')
global.io = require('socket.io')(httpServer, {cors : {origin: "*"}})

const loginController = require('./controllers/LoginController')
const registerController = require('./controllers/RegisterController')
const socketController = require("./controllers/SocketContoller")

app.use(cors({origin:true,credentials: true}))
app.use(bodyParser.json())
app.use(express.static("client/dist"))

mongoose.connect('mongodb://localhost:27017/chess?retryWrites=true&w=majority')
const db = mongoose.connection
db.on('error', (e) => {console.error(e)})
db.once('open', () => {console.log("Connected to MongoDB")})

//Routes
app.use('/register', registerController)
app.post('/login', loginController)

//Socket.io
io.on("connection", socketController)

httpServer.listen(3000, () => {
    console.log("Server started on port 3000")
})