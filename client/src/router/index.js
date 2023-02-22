import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import Lobby from '@/components/Lobby.vue'
import Intro from '@/components/Intro.vue'
import Game from '@/components/Game.vue'
import NotFound from '@/components/NotFound.vue'

const router = createRouter({
  history: createWebHashHistory(),
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
    },
    {
      path: '/:pathMatch(.*)',
      name: 'NotFound',
      component: NotFound
    }
  ]
})

export default router