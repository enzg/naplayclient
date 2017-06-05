// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import './assets/style/global.css'
import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})


router.beforeEach(({meta, path}, from, next) => {
  let {auth = true} = meta
  let isLogin = Boolean(store.getters.getCurrentToken)
  console.log('isLogin:',isLogin);
  if (auth  && !isLogin && path !== '/login') {
    return next({
      path: '/login'
    })
  }
  next()
})
