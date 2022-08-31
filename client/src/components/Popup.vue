<template>
    <div>
        <div class="popup">
            <slot></slot>
        </div>
        <div @click="$emit('cancel')" class="backdim"></div>
    </div>
</template>

<script>
export default {
  name: 'Popup'
}
</script>

<style scoped>
.popup {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: black;
  border: 2px solid white;
  padding: 20px;
  z-index: 2;
}

.backdim {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
}
</style>
