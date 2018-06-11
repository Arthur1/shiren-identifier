<template>
  <div id="app">
    <header-bar></header-bar>
    <main class="grey lighten-5">
      <router-view></router-view>
    </main>
    <footer-bar></footer-bar>
  </div>
</template>

<script>
import HeaderBar from './components/HeaderBar.vue'
import FooterBar from './components/FooterBar.vue'

export default {
  name: 'App',
  components: {
    HeaderBar,
    FooterBar,
  },
}
</script>

<style scoped>

</style>
