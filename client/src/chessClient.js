/* eslint-disable */
export function oponent(toMove){
    return toMove == "B" ? "W" : "B"
}

export function hashCode(inp) {
    var hash = 0;
    for (var i = 0; i < inp.length; i++) {
        var char = inp.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash;
    }
    return hash;
}

export function stringToSprite(pice) {
    const y = pice[0] == "W" ? 0 : 50
    let x
    switch (pice[1]){
        case "K":
            x = 0
            break
        case "Q":
            x = 50
            break
        case "B":
            x = 100
            break
        case "N":
            x = 150
            break
        case "R":
            x = 200
            break
        case "P":
            x = 250
            break
    }
    return [x,y]
}

export function promoteCheck(state, move) {
    return (state.board[move[0][1]][move[0][0]][1] == "P" && move[1][1] == (state.toMove == "W" ? 0 : 7))
}

export function calcMove(state, move) {
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