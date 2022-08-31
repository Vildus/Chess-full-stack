<template>
    <div v-show="isLoaded">
      <h4>{{state.whiteName}} vs {{state.blackName}}</h4>
      <canvas ref="canv" @click="canvClick" width="400" height="400"></canvas>
      <canvas class="prom" ref="prom" v-show="isProm" width="50" height="200"></canvas>
      <Popup @cancel="isPopup = false" v-if="isPopup">
        <h1>{{state.message}}</h1>
        <h2 v-if="state.winner == 'draw'">Draw!</h2>
        <h2 v-else>{{state.winner}} wins!</h2>
        <router-link v-if="isLogged" to="/lobby">Back to lobby</router-link>
        <router-link v-else to="/">Go home</router-link>
      </Popup>
      <Popup v-if="state.left">
        <h4>Oponent has left the game</h4>
        <button @click="claimClick">Claim win</button>
      </Popup>
    </div>
</template>

<script>
import * as moveGen from '../moveGen'
import * as chess from '../chessClient'
import Popup from './Popup.vue'

export default {
  name: 'Game',
  components: {
    Popup
  },
  props: ['isLogged', 'username'],
  data () {
    return {
      id: this.$route.params.id,
      state: {},
      specialBoard: [
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '']
      ],
      isLoaded: false,
      isProm: false,
      disabled: false,
      filteredMoves: [],
      selectedPos: [],
      selected: false,
      ctx: null,
      ctxProm: null,
      spriteSheet: null,
      isPopup: false
    }
  },
  beforeMount () {
    if (localStorage.getItem('token') === null) {
      this.$router.push({path: '/'})
    }
    this.$socket.emit('joinRoom', this.id)
  },
  mounted () {
    this.ctx = this.$refs.canv.getContext('2d')
    this.ctxProm = this.$refs.prom.getContext('2d')

    this.spriteSheet = new Image()
    this.spriteSheet.src = require('../assets/chessSpriteSheet.png')
    this.spriteSheet.onload = () => {
      this.ctxProm.fillRect(0, 0, 50, 200)
      for (let i = 0; i < 4; i++) {
        this.ctxProm.drawImage(this.spriteSheet, i * 50 + 50, 0, 50, 50, 0, i * 50, 50, 50)
      }
      this.updateGame()
    }
    this.$socket.on('connect', () => {
      this.$emit('joinRoom', this.id)
    })
    this.$socket.on('stateUpdate', (state) => {
      this.state = state
      this.isLoaded = true
      this.updateGame()
    })
  },
  methods: {
    async canvClick (e) {
      if (this.disabled || this.state.message) {
        return
      }
      let x = Math.floor((e.clientX - this.$refs.canv.getBoundingClientRect().left) / 50)
      let y = Math.floor((e.clientY - this.$refs.canv.getBoundingClientRect().top) / 50)
      if (this.flipped) {
        x = 7 - x
        y = 7 - y
      }
      if (this.state.board[y][x] !== '' && this.playerSide === this.state.toMove) {
        if (this.state.board[y][x][0] === this.state.toMove) {
          this.clearBoard()
          this.filteredMoves = this.legalMoves.filter(move => move[0][0] === x && move[0][1] === y).map(move => move[1])
          this.selected = true
          this.selectedPos = [x, y]
          this.specialBoard[y][x] = 'yellow'
          this.filteredMoves.forEach((movePos) => {
            this.specialBoard[movePos[1]][movePos[0]] = 'green'
          })
          this.updateGame()
        }
      }
      let clickedMove = false
      this.filteredMoves.forEach((move) => {
        if (move[0] === x && move[1] === y) {
          clickedMove = true
        }
      })
      if (this.selected && clickedMove) {
        let move = [[this.selectedPos[0], this.selectedPos[1]], [x, y]]
        if (chess.promoteCheck(this.state, move)) {
          this.disabled = true
          let promPice = await this.getProm()
          move.push(promPice)
          this.disabled = false
        }
        this.state = chess.calcMove(JSON.parse(JSON.stringify(this.state)), move)
        this.$socket.emit('move', this.id, move)
        this.selected = false
        this.clearBoard()
        this.updateGame()
      }
    },
    getProm () {
      return new Promise(resolve => {
        let piceArray = ['Q', 'B', 'N', 'R']
        this.isProm = true
        this.$refs.prom.addEventListener('click', (e) => {
          let y = Math.floor((e.clientY - this.$refs.canv.getBoundingClientRect().top) / 50)
          this.isProm = false
          alert(y)
          resolve(piceArray[y])
        })
      })
    },
    claimClick () {
      this.$socket.emit('claimWin')
    },
    clearBoard () {
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          this.specialBoard[y][x] = ''
        }
      }
    },
    updateGame () {
      if (this.state.message) {
        this.isPopup = true
      }
      this.legalMoves = moveGen.moveGen(this.state)
      this.ctx.fillStyle = 'black'
      this.ctx.fillRect(0, 0, 400, 400)
      this.ctx.strokeStyle = 'white'
      this.ctx.fillStyle = 'gray'
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          let realx = this.flipped ? 7 - x : x
          let realy = this.flipped ? 7 - y : y
          // bw squares
          this.ctx.fillStyle = 'gray'
          if ((realx + realy) % 2 === 0) {
            this.ctx.fillRect(y * 50, x * 50, 50, 50)
          }
          // Special Board
          if (this.specialBoard[realx][realy] !== '') {
            this.ctx.fillStyle = this.specialBoard[realx][realy]
            this.ctx.fillRect(y * 50, x * 50, 50, 50)
          }
          // Borders
          this.ctx.strokeRect(y * 50, x * 50, 50, 50)
          // Sprites
          if (this.state.board[realx][realy] !== '') {
            let pos = chess.stringToSprite(this.state.board[realx][realy])
            this.ctx.drawImage(this.spriteSheet, pos[0], pos[1], 50, 50, y * 50, x * 50, 50, 50)
          }
        }
      }
    }
  },
  computed: {
    flipped () {
      return this.state.blackName === this.username
    },
    playerSide () {
      if (this.username === this.state.whiteName) {
        return 'W'
      } else if (this.username === this.state.blackName) {
        return 'B'
      } else {
        return 'S'
      }
    }
  }
}
</script>

<style scoped>

h4 {
  margin: 1rem
}

button {
  background: transparent;
  border: 4px solid white;
  color: white;
  cursor: pointer;
  padding: 10px 30px;
  font-size: 2.5rem;
}

button:hover {
  background: #333333;
}

canvas {
  background: transparent;
  border: 4px solid white;
}

p {
  color: yellow
}

.prom {
  position: absolute
}
</style>
