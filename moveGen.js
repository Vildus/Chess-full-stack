const chess = require("./chessServer")

function moveGen(state) {
    let toMove = state.toMove
    let board = state.board
    let enPass = state.enPass
    let moves = []
    let attackMap = getAttackMap(board, toMove)
    for (let y = 0; y< 8; y++) {
        for (let x = 0; x< 8; x++) {
            if(board[y][x][0] == toMove) {
                switch (board[y][x][1]) {
                    case "Q":
                        moves = moves.concat(diagonalCycle(x,y,board, toMove, false),cardinalCycle(x,y,board, toMove, false))
                        break
                    case "B":
                        moves = moves.concat(diagonalCycle(x,y,board, toMove, false))
                        break
                    case "N":
                        moves = moves.concat(knightMove(x,y,board,toMove, false))
                        break
                    case "R":
                        moves = moves.concat(cardinalCycle(x,y,board, toMove, false))
                        break
                    case "P":
                        moves = moves.concat(pawnMove(x,y,board,toMove, enPass))
                        break
                    case "K":
                        moves = moves.concat(kingCycle(x,y,state,toMove, false, attackMap, true))
                        break
                }
            } 
        }
    }
    moves = moves.filter((inpMove) => {
        let nestPos = chess.calcMove(JSON.parse(JSON.stringify(state)), inpMove)
        let nextAttackMap = getAttackMap(nestPos.board, toMove)
        return !checkCheck(nestPos.board, toMove, nextAttackMap)
    })
    if (moves.length == 0) {
        if (checkCheck(board, toMove, attackMap)) {
            moves.push("M")
        } else {
            moves.push("S")
        }
    }
    return moves
}

function checkCheck(board, toMove, attackMap) {
    for (let y = 0; y< 8; y++) {
        for (let x = 0; x< 8; x++) { 
            if (board[y][x] == `${toMove}K`) {
                 return attackMap[y][x]
            }        
        }
    }
    console.error("checkCheck Fail")
}

function knightMove(x,y,board,toMove, attack) {
    let moves = []
    const knightNums = [-2,-1,1,2]
    knightNums.forEach((i) => {
        knightNums.forEach((j) => {
            if (Math.abs(i) != Math.abs(j) && x+i >= 0 && x+i < 8 && y+j >=0 && y+j < 8) {
                if (board[y+j][x+i] == "") {
                    moves.push([[x,y],[x+i,y+j]])
                } else {
                    if (board[y+j][x+i][0] != toMove || attack) {
                        moves.push([[x,y],[x+i,y+j]])
                    }
                }
            }
        })
    })
    return moves
}

function pawnMove(x,y,board,toMove, enPass) {
    let moves = []
    if (toMove == "W") {
        if (board[y-1][x] == "") {
            moves.push([[x,y],[x,y-1]])
            if (y == 6 && board[4][x] == "") {
                moves.push([[x,6],[x,4]])
            }
        }
        if (x+1 < 8) {
            if (board[y-1][x+1] != ""){
                if (board[y-1][x+1][0] != toMove) {
                    moves.push([[x,y],[x+1,y-1]])
                } 
            }
        }
        if (x-1 >= 0) {
            if (board[y-1][x-1] != ""){
                if (board[y-1][x-1][0] != toMove) {
                    moves.push([[x,y],[x-1,y-1]])
                } 
            }
        }
    } else {
        if (board[y+1][x] == "") {
            moves.push([[x,y],[x,y+1]])
            if (y == 1 && board[3][x] == "") {
                moves.push([[x,1],[x,3]])
            }
        }
        if (x+1 < 8) {
            if (board[y+1][x+1] != ""){
                if (board[y+1][x+1][0] != toMove) {
                    moves.push([[x,y],[x+1,y+1]])
                } 
            }
        }
        if (x-1 >= 0) {
            if (board[y+1][x-1] != ""){
                if (board[y+1][x-1][0] != toMove) {
                    moves.push([[x,y],[x-1,y+1]])
                } 
            }
        }
    }
    if (enPass) {
        if (Math.abs(x-enPass[0]) == 1 && y-enPass[1] == (toMove == "W" ? 1 : -1)) {
            moves.push([[x,y],[enPass[0],enPass[1]]])
        }
    }
    if (y == (toMove=="W"? 1:6)) {
        moves = moves.flatMap(move => {
            let vars = []
            let pices = ["R","B","N","Q"]
            pices.forEach(pice => {
                let newMove = JSON.parse(JSON.stringify(move))
                newMove[2] = pice
                vars.push(newMove) 
            })
            return vars
        })        
    }
    return moves
}

function kingCycle(x,y,state,toMove, attack, attackMap, canCastle) {
    let board = state.board
    let moves = []
    for (let i = -1; i < 2; i++) {
        for (let j = -1 ; j < 2; j++) {
            if (!(i == 0 && j == 0) && x+i >= 0 && x+i < 8 
            && y+j < 8 && y+j >= 0 && board[y+j][x+i][0] != toMove) {
                if (attack) {
                    moves.push([[x,y],[x+i,y+j]])
                } else {
                    if ((!attackMap[y+j][x+i])) {
                        moves.push([[x,y],[x+i,y+j]])
                    }
                }
            }
        }
    }
    let shortX = [5,6]
    let longX = [2,3]
    if (!attack && canCastle && !checkCheck(board, toMove, attackMap)) {
        let canShort = state.toMove == "W" ? state.whiteShort : state.blackShort
        let canLong = state.toMove == "W" ? state.whiteLong : state.blackLong
        shortX.forEach((searchX) => {
            if (board[y][searchX] != "" || attackMap[y][searchX]) {
                canShort = false
            }
        })
        longX.forEach((searchX) => {
            if (board[y][searchX] != "" || attackMap[y][searchX]) {
                canLong = false
            }
        })
        if (canShort) {moves.push([[x,y],[x+2,y]])}
        if (canLong) {moves.push([[x,y],[x-2,y]])}
    }
    return moves
}

function cardinalCycle(x,y,board,toMove, attack) {
    let moves = []
    for (let i = x+1; i < 8; i++) {
        if(board[y][i] == "") {
            moves.push([[x,y],[i,y]])
        } else if(!attack && board[y][i][0] == toMove) {
            break
        } else {
            moves.push([[x,y],[i,y]])
            break
        }
    }
    for (let i = x-1; i >= 0; i--) {
        if(board[y][i] == "") {
            moves.push([[x,y],[i,y]])
        } else if(!attack && board[y][i][0] == toMove) {
            break
        } else {
            moves.push([[x,y],[i,y]])
            break
        }
    }
    for (let i = y+1; i < 8; i++) {
        if(board[i][x] == "") {
            moves.push([[x,y],[x,i]])
        } else if(!attack && board[i][x][0] == toMove) {
            break
        } else {
            moves.push([[x,y],[x,i]])
            break
        }
    }
    for (let i = y-1; i >= 0; i--) {
        if(board[i][x] == "") {
            moves.push([[x,y],[x,i]])
        } else if(!attack && board[i][x][0] == toMove) {
            break
        } else {
            moves.push([[x,y],[x,i]])
            break
        }
    }
    return moves
}

function diagonalCycle(x,y,board, toMove, attack) {
    let moves = []
    for (let i = 1; i+x < 8 && i+y < 8; i++) {
        if(board[y+i][x+i] == "") {
            moves.push([[x,y],[x+i,y+i]])
        } else if(!attack && board[y+i][x+i][0] == toMove) {
            break
        } else {
            moves.push([[x,y],[x+i,y+i]])
            break
        }
    }
    for (let i = 1; x-i >= 0 && i+y < 8; i++) {
        if(board[y+i][x-i] == "") {
            moves.push([[x,y],[x-i,y+i]])
        } else if(!attack && board[y+i][x-i][0] == toMove) {
            break
        } else {
            moves.push([[x,y],[x-i,y+i]])
            break
        }
    }
    for (let i = 1; i+x < 8 && y-i >= 0; i++) {
        if(board[y-i][x+i] == "") {
            moves.push([[x,y],[x+i,y-i]])
        } else if(!attack && board[y-i][x+i][0] == toMove) {
            break
        } else {
            moves.push([[x,y],[x+i,y-i]])
            break
        }
    }
    for (let i = 1; x-i >= 0 && y-i >= 0; i++) {
        if(board[y-i][x-i] == "") {
            moves.push([[x,y],[x-i,y-i]])
        } else if(!attack && board[y-i][x-i][0] == toMove) {
            break
        } else {
            moves.push([[x,y],[x-i,y-i]])
            break
        }
    }
    return moves
}

function pawnAttack(x,y,board,toMove) {
    let moves = []
    if (toMove == "W") {
        if (x+1 < 8) {
            moves.push([[x,y],[x+1,y-1]])
        }
        if (x-1 >= 0) {
            moves.push([[x,y],[x-1,y-1]])
        }
    } else {
        if (x+1 < 8) {
            moves.push([[x,y],[x+1,y+1]])
        }
        if (x-1 >= 0) {
            moves.push([[x,y],[x-1,y+1]])
        }
    }
    return moves
}

function getAttackMap(board, toMove) {
        let moves = []
        let attackMap = [
            [false,false,false,false,false,false,false,false],
            [false,false,false,false,false,false,false,false],
            [false,false,false,false,false,false,false,false],
            [false,false,false,false,false,false,false,false],
            [false,false,false,false,false,false,false,false],
            [false,false,false,false,false,false,false,false],
            [false,false,false,false,false,false,false,false],
            [false,false,false,false,false,false,false,false]
        ]
        let oponentChar = chess.oponent(toMove)
        for (let y = 0; y< 8; y++) {
            for (let x = 0; x< 8; x++) {
                if(board[y][x][0] == oponentChar) {
                    switch (board[y][x][1]) {
                        case "Q":
                            moves = moves.concat(diagonalCycle(x,y,board, oponentChar, true),cardinalCycle(x,y,board, toMove, true))
                            break
                        case "B":
                            moves = moves.concat(diagonalCycle(x,y,board, oponentChar, true))
                            break
                        case "N":
                            moves = moves.concat(knightMove(x,y,board,oponentChar, true))
                            break
                        case "R":
                            moves = moves.concat(cardinalCycle(x,y,board, oponentChar, true))
                            break
                        case "P":
                            moves = moves.concat(pawnAttack(x,y,board,oponentChar, true))
                            break
                        case "K":
                            moves = moves.concat(kingCycle(x,y,{board: board},toMove, true))
                            break 
                    }
                } 
            }
        }
        let squares = moves.map(move => move[1])
        squares.forEach(square => {
            attackMap[square[1]][square[0]] = true
        })
        return attackMap
}

module.exports = moveGen