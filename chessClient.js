function oponent(toMove){
    return toMove == "B" ? "W" : "B"
}

function hashCode(inp) {
    var hash = 0;
    for (var i = 0; i < inp.length; i++) {
        var char = inp.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash;
    }
    return hash;
}

function checkEnd(state) {
    const legalMoves = require('./moveGen')(state)
    if (legalMoves.length == 1) {
        if (legalMoves[0] == "M") {
            return {message: "Mate", draw: false}
        } else if (legalMoves[0] == "S") {
            return {message: "Stalemate", draw: false}
        }
    }
    if (state.fifty >= 50) {
        return {message: "Draw by 50 moves", draw: true}
    }
    if (state.hash.filter(a => a==state.hash[state.hash.length-1]).length == 3) {
        return {message: "Draw by repetition", draw: true}
    }
    if (checkMaterial(state)) {
        return {message: "Draw by insufficient material", draw: true}
    }
    return false
}

function checkMaterial(state) {
    let board = state.board
    let whiteCount = 0
    let blackCount = 0
    for (let y = 0; y< 8; y++) {
        for (let x = 0; x< 8; x++) {
            let pice = board[y][x]
            if (pice != "") {
                if (pice[1] == "R" || pice[1] == "Q" || pice[1] == "P") {
                    return false
                }
                if (pice[1] == "B" || pice[1] == "N") {
                    if (pice[0] == "W") {
                        whiteCount++
                    } else {
                        blackCount++
                    }
                }
            }
            if (whiteCount > 1 || blackCount > 1) {
                return false
            }
        }
    }
    return true
}

function calcMove(state, move) {
    let toMove = state.toMove
    let inpBoard = state.board
    let result = inpBoard
    let resultState = state
    let src = move[0]
    let dest = move[1]
    let pice = inpBoard[src[1]][src[0]]
    resultState.fifty += 0.5
    if (inpBoard[dest[1]][dest[0]] != "") {
        resultState.fifty = 0
    }
    if (pice[1] == "P" && Math.abs(dest[0]-src[0]) == 1 && inpBoard[dest[1]][dest[0]] == "") {
        result[toMove == "W" ? dest[1]+1 : dest[1]-1][dest[0]] = ""
    }
    result[src[1]][src[0]] = ""
    result[dest[1]][dest[0]] = pice
    if (pice[1] == "K" && Math.abs(src[0]-dest[0]) == 2) {
        if(src[0]-dest[0] > 0) {
            let rook = inpBoard[src[1]][0]
            result[src[1]][0] = ""
            result[src[1]][3] = rook
        } else {
            let rook = inpBoard[src[1]][7]
            result[src[1]][7] = ""
            result[src[1]][5] = rook
        }
    }

    resultState.board = result
    if (pice[1] == "K") {
        if (toMove == "W") {
            resultState.whiteLong = false
            resultState.whiteShort = false
        } else {
            resultState.blackLong = false
            resultState.blackShort = false
        }
    }
    if (pice[1] == "R") {
        if (src[0] == 0) {
            if (toMove == "W") {
                resultState.whiteLong = false
            } else {
                resultState.blackLong = false
            }
        } else if (src[0] == 7) {
            if (toMove == "W") {
                resultState.whiteShort = false
            } else {
                resultState.blackShort = false
            }
        }
    }
    if (pice[1] == "P" && dest[1] == (toMove=="W"? 0:7)) {
        result[dest[1]][dest[0]] = `${toMove}${move[2]}`
    }
    if (pice[1] == "P" && Math.abs(dest[1]-src[1]) == 2) {
        resultState.enPass = [dest[0], toMove == "W" ? dest[1]+1 : dest[1]-1]
    } else {
        resultState.enPass = null
    }
    resultState.toMove = oponent(resultState.toMove)
    resultState.hash.push(hashCode(JSON.stringify(resultState.board)))
    return resultState 
}

module.exports = {calcMove: calcMove, oponent: oponent, checkEnd: checkEnd}