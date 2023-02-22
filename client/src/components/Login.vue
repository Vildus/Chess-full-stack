<template>
  <div class="form">
    <p>Name:</p>
    <input type="text" v-model="name">
    <p>Password:</p>
    <input type="password" v-model="password">
    <button @click="login">Login</button>
    <p class="top-margin">New? go <router-link to="/register">Register</router-link>!</p>
    <p>{{msg}}</p>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Login',
  data () {
    return {
      msg: '',
      name: '',
      password: ''
    }
  },
  methods: {
    async login () {
      const res = await axios.post('/api/login', {
        name: this.name,
        password: this.password
      })
      if (!res.data.login) {
        this.msg = 'Wrong name or password'
      } else {
        this.$emit('login', res.data)
        this.$router.push({path: '/'})
      }
    }
  }
}
</script>

<style scoped>
input {
    background: transparent;
    border: 2px solid white;
    color: white;
    text-align: center;
    font-size: 1.3rem;
    width: 100%;
    display: block;
    padding: 5px;
    margin: 20px;
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

.top-margin {
  margin-top: 20px
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 3px solid white;
  padding: 30px;
}

p {
  margin: 0;
  font-size: 1.5rem;
}

.disabled {
    color: gray;
    border-color: gray;
    cursor: not-allowed;
}

a {
  color: white;
}
</style>
