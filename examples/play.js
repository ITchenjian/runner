import Vue from 'vue';
import Runner from 'main/index.js';                 //main会被重写为../src, 参考build/config.js文件
import App from './play/index.vue';
import './assets/styles/common.css';
import 'packages/theme-chalk/src/index.scss';       //packages会被重写为../packages, 参考build/config.js文件
import 'packages/theme-element/theme/index.css'

Vue.use(Runner);

new Vue({
    render: h => h(App)
}).$mount('#app');
