import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Lobby from '@/components/Lobby'
import Intro from '@/components/Intro'
import Game from '@/components/Game'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/lobby',
      name: 'Lobby',
      component: Lobby
    },
    {
      path: '/',
      name: 'Intro',
      component: Intro
    },
    {
      path: '/game/:id',
      name: 'Game',
      component: Game
    }
  ]
})
