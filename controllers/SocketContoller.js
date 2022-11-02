const jwt = require('jsonwebtoken')

const User = require('../models/user')
const Game = require('../models/game')
const Active = require("../models/active")

const moveGen = require('../moveGen')
const chess = require('../chessServer')

async function updateActive(id) {
    const active = await Active.findById(id)
    const white = active.white.name
    const black = active.black.name
    io.to(id).emit('stateUpdate', {
        ...JSON.parse(active.state),
        wTime: active.whiteTime,
        bTime: active.blackTime,
        whiteName: white,
        blackName: black,
        left: active.left
    })
}

async function updateLobby() {
    const games = await Game.find()
    io.emit("lobbyUpdate", games)
}

async function getSocketByName(name) {
    const sockets = await io.fetchSockets()
    for (const socket of sockets) {
        if (socket._name == name) {
            return socket
        }
    }
}

function controller(socket) {
    console.log("Socket connected: " + socket.id)
    socket.on("disconnect", async (reason) => {
        console.log("Socket disconnected: " + socket.id)
        if (socket._room) {
            const active = await Active.findById(socket._room)
            if (active.white.name == socket._name) {
                active.left = "W"
            } else if (active.black.name == socket._name) {
                active.left = "B"
            } else {
                return
            }
            await active.save()
            updateActive(socket._room)
        }
    })
    socket.on("login", (token) => {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
            if (err) return
            const user = await User.findById(payload.id)
            if (user) {
                socket._name = user.name
                socket._token = token
                socket._id = user.id
                console.log("Socket logged: " + user.name)
                socket.emit("logged", user.name) 
            }
        })
    })
    socket.on("logout", () => {
        console.log("Socket unlogged: " + socket._name)
        socket._name = null
        socket._token = null
        socket._id = null
    })
    socket.on("createGame", async (time, inc, cb) => {
        const game = new Game({
            name: socket._name,
            time: time,
            inc: inc
        })
        try {
            const newGame = await game.save()
            console.log("Game created by " + socket._name + " " + time + " " + inc)
            cb("Game created")
            updateLobby()
        } catch {
            console.warn("False game creation by " + socket._name)
            cb("Game not created")
        }
    })
    socket.on("cancelGame", async () => {
        if (!socket._token) {
            // TODO: IP Ban
            return
        }
        await Game.deleteOne({name: socket._name})
        updateLobby()
    }),
    socket.on("fetchGames", async () => {
        const games = await Game.find()
        socket.emit("lobbyUpdate", games)
    }),
    socket.on("joinRoom", async (id) => {
        let active
        if (!socket._name) {
            console.log("Unloged user attempted to join room " + id)
            return
        }
        try {
            active = await Active.findById(id)
        } catch {
            console.log(socket._name + " tried to join idiotical active")
        }
        if (!active) {
            console.log(socket._name + " tried to join unexistent active")
            return
        }
        socket.join(id)
        socket._room = id
        console.log("Socket " + socket._name + " joined room " + socket._room)
        if (active.left) {
            if ((active.left == "W" && socket._name == active.white.name)
            ||  (active.left == "B" && socket._name == active.black.name)) {
                active.left = ""
                await active.save()
            }
        }
        updateActive(id)
    })
    socket.on("move", async (id, move) => {
        const active = await Active.findById(id)
        if (!active) {
            return
        }
        if (socket._room != id) {
            // TODO: IP ban :)
            return
        }
        if (active.ended) {
            return
        }
        const state = JSON.parse(active.state)
        const moves = moveGen(state)
        if (!(moves.some((ele) => {return JSON.stringify(ele) === JSON.stringify(move)}))) {
            // TODO: IP ban :)
            return
        }
        const newState = chess.calcMove(state, move)
        const end = chess.checkEnd(state)
        if(end) {
            active.ended = true
            newState.message = end.message
            if (end.draw) {
                newState.winner = "Draw"
            } else if (newState.toMove == "B") {
                newState.winner = active.white.name
            } else {
                newState.winner = active.black.name
            }
        }
        active.state = JSON.stringify(newState)
        await active.save()
        updateActive(id)
    })
    socket.on("claimWin", async () => {
        if (!socket._name || !socket._room) {
            // TODO: IP ban :)
            return
        }
        const active = await Active.findById(socket._room)
        if (!active.left) {
            // TODO: IP ban :)
            return
        }
        console.log(socket._name + " claimed win on game; left=" + active.left)
        active.ended = true
        const state = JSON.parse(active.state)
        state.winner = socket._name
        state.message = "Oponent left the game"
        active.left = ""
        active.state = JSON.stringify(state)
        await active.save()
        updateActive(socket._room)
    })
    socket.on("joinGame", async (game) => {
        const foundGame = await Game.findById(game._id)
        if (!foundGame) {
            console.warn(socket._name + " Attempted to join unexistent game!")
            return
        }
        if (foundGame._name === socket._name) {
            console.warn(socket._name + " Attempted to join his own game!")
            return
        }
        console.log(socket._name + " joined " + game.name + "'s game")
        try {
            const oponent = await getSocketByName(game.name)
            const active = new Active({
                state: JSON.stringify(
                    {
                        board: [
                            ["BR","BN","BB","BQ","BK","BB","BN","BR"],
                            ["BP","BP","BP","BP","BP","BP","BP","BP"],
                            ["","","","","","","",""],
                            ["","","","","","","",""],
                            ["","","","","","","",""],
                            ["","","","","","","",""],
                            ["WP","WP","WP","WP","WP","WP","WP","WP"],
                            ["WR","WN","WB","WQ","WK","WB","WN","WR"]
                        ], 
                        whiteShort: true,
                        whiteLong: true,
                        blackShort: true,
                        blackLong: true,
                        toMove: "W",
                        fifty: 0,
                        hash: [],
                        enPass: null
                    }
                ),
                whiteTime: game.time * 60,
                blackTime: game.time * 60,
                inc: game.inc,
                white: {
                    userId: socket._id,
                    name: socket._name,
                    token: socket._token
                },
                black: {
                    userId: oponent._id,
                    name: oponent._name,
                    token: oponent._token
                }
            })
            const newActive = await active.save()
            socket.emit("joinGame", newActive.id)
            oponent.emit("joinGame", newActive.id)
            await Game.deleteOne({name: game.name})
            await Game.deleteOne({name: socket._name})         
        } catch {
            console.warn("Active creation failed!")
        }
        updateLobby()
    })
}

module.exports = controller