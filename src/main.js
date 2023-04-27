import Vue from 'vue'
import App from './App.vue'
import SuperFlow from 'vue-super-flow'
import 'vue-super-flow/lib/index.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(SuperFlow)
Vue.use(ElementUI);

import vueDropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'

export default {
  components: {
    vueDropzone
  }
}
new Vue({
  render: h => h(App),
}).$mount('#app')
