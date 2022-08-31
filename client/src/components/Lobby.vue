<template>
  <div v-if="isLoaded" class="container">
    <button v-if="gameCreated" class="cancel bmargin" @click="cancelClick">Cancel Game</button>
    <button v-else class="bmargin" @click="createClick">Create Game</button>
    <Popup @cancel="isPrompted = false" v-if="isPrompted">
      <h3>Create Game</h3>
      <p>Time: {{rawTime}} min</p>
      <input v-model="rawTime" min="1" max="20" type="range">
      <p>Increment: {{rawIncrement}} sec</p>
      <input v-model="rawIncrement" min="0" max="60" type="range">
      <button @click="createGame">Create</button>
    </Popup>
    <div class="lobby">
        <div @click="joinClick(game)" v-for="game in games" :key="game._id" class="game">
            <h4>{{game.name}}</h4>
            <p>{{game.time}}:00<span v-if = "game.inc > 0">+{{game.inc}}</span></p>
            <div class="circle" :class="game.starts"></div>
        </div>
        <div v-if = "games.length == 0">
            <h4>No games here</h4>
        </div>
    </div>
  </div>
</template>

<script>
import Popup from './Popup.vue'

export default {
  name: 'Lobby',
  components: {
    Popup
  },
  props: ['username', 'isLogged', 'token'],
  data () {
    return {
      isPrompted: false,
      rawTime: 10,
      rawIncrement: 30,
      isLoaded: false,
      games: []
    }
  },
  beforeMount () {
    if (localStorage.getItem('token') === null) {
      this.$router.push({path: '/'})
    }
    this.fetchGames()
  },
  mounted () {
    this.$socket.on('lobbyUpdate', (games) => {
      this.games = games
      this.isLoaded = true
    })
    this.$socket.on('joinGame', (id) => {
      const route = '/game/' + id
      this.$router.push({path: route})
    })
  },
  methods: {
    createClick () {
      this.isPrompted = true
    },
    async cancelClick () {
      this.$socket.emit('cancelGame')
    },
    joinClick (game) {
      console.log(game)
      if (game.name === this.username) {
        return
      }
      this.$socket.emit('joinGame', game)
    },
    createGame () {
      this.isPrompted = false
      this.$socket.emit('createGame', this.rawTime, this.rawIncrement, res => {
        console.log(res)
      })
    },
    async fetchGames () {
      this.$socket.emit('fetchGames')
    }
  },
  computed: {
    gameCreated () {
      let ans = false
      this.games.forEach(game => {
        if (game.name === this.username) {
          ans = true
        }
      })
      return ans
    }
  }
}
</script>

<style scoped>
h4 {
  padding: 20px;
}

.lobby {
    border: 3px solid white;
    max-width: 800px;
}

button {
    background: transparent;
    border: 4px solid white;
    color: white;
    cursor: pointer;
    padding: 10px 20px;
    font-size: 1.5rem;
}

.cancel {
  background: #660000;
}

.cancel:hover {
  background: #EE0000;
}

.bmargin {
  margin-bottom: 50px;
}

input {
    background: transparent;
    border: 2px solid white;
    color: white;
    font-size: 1.3rem;
    display: block;
    padding: 5px;
    margin: 5px;
    width: 100%;
}

button:hover {
  background: #333333;
}

p {
    margin: 0.5rem;
    font-size: 1.5rem;
}

h4 {
    transition: all 0.3s ease;
}

.game {
    display: grid;
    grid-template-columns: auto 150px 30px;
    align-items: center;
    border: 2px solid gray;
    padding: 10px;
    cursor: pointer;
}

span {
    font-size: 1rem;
}

.game:hover {
    background: #333333;
}

.circle {
    width: 20px;
    height: 20px;
    border: 3px solid white;
    border-radius: 50%;
}

.white {
    background: white;
}

.random {
    background: repeating-linear-gradient(45deg, black,black 2px, white 2px, black 4px);
}

.black {
    background: black;
}

@media screen and (max-width: 700px) {
    h4 {
        font-size: 1.5rem;
    }
}
</style>
