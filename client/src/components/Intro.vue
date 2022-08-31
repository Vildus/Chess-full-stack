<template>
    <div>
        <img src="../assets/SPSChess.png" class="logo" alt="logo">
        <h1>SPŠ Chess</h1>
        <h4 v-if="isLogged">Go to <router-link to="/lobby">Lobby</router-link></h4>
    </div>
</template>

<script>
export default {
  name: 'Intro',
  props: ['isLogged']
}
</script>

<style scoped>
.logo {
    box-shadow: 0px 0px 50px #444444;
    border-radius: 20px;
}

h1 {
    margin: 30px;
}
</style>
