<template>
  <div class="form">
    <p>Name:</p>
    <input type="text" v-model="name">
    <p>Password:</p>
    <input type="password" v-model="password">
    <p>Password again:</p>
    <input type="password" v-model="passwordCheck">
    <button :class="(active) ? '' : 'disabled'" @click="register">Register</button>
    <p class="top-margin">Have an account? go <router-link to="/login">Login</router-link>!</p>
    <p>{{msg}}</p>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Register',
  data () {
    return {
      msg: '',
      name: '',
      password: '',
      passwordCheck: '',
      active: true
    }
  },
  methods: {
    async register () {
      if (!this.active) {
        return
      }
      const res = await axios.post('/api/register', {
        name: this.name,
        password: this.password,
        passwordChec: this.passwordCheck
      })
      this.msg = res.data.message
      if (res.data.message === 'Registered') {
        this.active = false
        this.msg = 'Registered redirecting...'
        setTimeout(() => {
          this.$router.push({path: '/login'})
        }, 1000)
      }
      console.log(res.data)
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
