<template>
  <div id="app">
    <nav>
      <router-link class="logo" to="/"><img height="50"  src="./assets/logo.png"></router-link>
      <div v-if="!loggedIn" class="login">
        <router-link to="/login">Login</router-link>
        <router-link to="/register">Register</router-link>
      </div>
      <div class="login" v-else>
        <p><span class="logout" @click="logout">Logout</span> {{username}}</p>
      </div>
    </nav>
    <router-view
    @login="login"
    :token="token"
    :username='username'
    :isLogged='loggedIn'/>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'App',
  data () {
    return {
      loggedIn: false,
      token: '',
      username: ''
    }
  },
  methods: {
    login (data) {
      this.token = data.token
      this.username = data.name
      this.loggedIn = true
      localStorage.setItem('token', this.token)
      this.$socket.emit('login', this.token)
    },
    logout () {
      this.token = ''
      this.username = ''
      this.loggedIn = false
      localStorage.removeItem('token')
      this.$router.push({path: '/'})
    }
  },
  created () {
    this.$socket.on('connect', () => {
      console.log('Connected socket: ' + this.$socket.id)
      if (this.token) {
        this.$socket.emit('login', this.token)
      }
    })
  },
  async beforeMount () {
    if (localStorage.getItem('token')) {
      const res = await axios.post('/login', {
        token: localStorage.getItem('token')
      })
      if (res.data.login) {
        this.login(res.data)
      }
    }
  }
}
</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

h1 {
    margin: 10px;
    user-select: none;
}

p {
    font-size: 2rem;
    margin: 1rem;
}

nav {
  width: 100%;
  position: absolute;
  top: 0;
  display: flex;
  justify-content: space-between;
  background: #222222;
}

canvas {
    background: transparent;
    border: 4px solid white;
}

.login {
  display: flex;
  align-items: center;
}

.login p {
  margin: 0 10px;
}

.login a {
  margin: 10px;
}

.logout {
  font-size: 1.5rem;
  text-decoration: underline;
  cursor: pointer;
}

.logo {
  padding: 5px;
}

a {
  color: white;
  font-size: 1.2rem;
}

#prom {
    position: absolute;
    display: none;
}

#splash {
    color: yellow;
}

#app {
  height: 100vh;
    width: 100vw;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: black;
    color: white;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    text-align: center;
    font-size: 2rem;
}
</style>
