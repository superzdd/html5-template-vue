import Vue from 'vue';
import App from './App.vue';
// eslint-disable-next-line no-unused-vars
// import soundjs from './util/soundjs';

// eslint-disable-next-line no-unused-vars
import store from './util/store.js';

import router from './router';
// eslint-disable-next-line no-unused-vars
// const vConsole = require('./util/vconsole.js');

Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
