<template>
    <div id="app">
        <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
        </div>-->
        <router-view @loadComplete="loadCompleteHandler" />
    </div>
</template>

<script>
export default {
    methods: {
        loadCompleteHandler() {
            console.log('app.vue loadComplete');
        },
    },
};
</script>

<style lang="scss">
body {
    --rem-height: 0rem;
    --px-height: 0px;
    --circle-radius: 0px;
}

#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    // margin-top: 60px;
}
</style>
