// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import _ from 'lodash'
import axios from 'axios'
import CryptoJS from 'crypto-js'
import VueMoment from 'vue-moment'
import VueResource from 'vue-resource'
import VueCookies from 'vue-cookies'
import VueLocalStorage from 'vue-localstorage'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// import router
import router from './router'

// import functions
import FUNCTIONS from './functions'

// import functions sso
import SSO from './functions/sso'

// import services api
import services from './services'

// import style plugin
import 'element-ui/lib/theme-chalk/index.css'

// Create Global Variable
Vue.prototype.axios = axios
Vue.prototype.$baseUrl = process.env.BASE_URL + 'core/' + process.env.CMSAPI_URL
Vue.prototype.$baseUrlAuth = process.env.BASE_URL + 'auth/'
Vue.prototype.$baseUrlAuthCMS = process.env.BASE_URL + 'auth/' + process.env.CMSAPI_URL
Vue.prototype.$FUNCTIONS = FUNCTIONS
Vue.prototype.$CryptoJS = CryptoJS
Vue.prototype.$services = services

//tell vue to use the router
Vue.use(ElementUI, { locale })
Vue.use(VueMoment)
Vue.use(VueLocalStorage)
Vue.use(VueResource)
Vue.use(VueCookies)
VueCookies.config('30d')
Vue.component('font-awesome-icon', FontAwesomeIcon)

// check token from sso login
SSO.init()

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	components: { App },
	template: '<App/>'
})
