import Vue from 'vue'
import VueCookies from 'vue-cookies'
import CryptoJS from 'crypto-js'
import FUNCTIONS from './index'

Vue.use(VueCookies)

export default {
	keyPhrase: process.env.KEY_UNLOCK,
	url: process.env.BASE_URL + "auth/sso",
	urlSiteKey: "4483893",
	urlSiteSecrect: "0d79a05f5a3a914daa48534d5f50bb3a34558a3f",
	buildUrl(isLogin){
		let logout = isLogin === true ? '' : '/logout'
		return this.url + logout + "?site_key=" + this.urlSiteKey + "&site_secret=" + this.urlSiteSecrect
	},
	init(){
		this.getTokenSSO() !== null ? this.setTokenSSO() : ""
		FUNCTIONS.configAxios()
		this.setGlobalData()
	},
	setGlobalData(){
		if($cookies.get(CryptoJS.MD5('id_token').toString())
			&& $cookies.get(CryptoJS.MD5('new_dashboard').toString())
			&& $cookies.get(CryptoJS.MD5('config_db').toString())){
			if(Vue.localStorage.get(CryptoJS.MD5('permission').toString())){
				let decriptRoles = CryptoJS.AES.decrypt(Vue.localStorage.get(CryptoJS.MD5('permission').toString()), this.keyPhrase)
				let originalRoles = decriptRoles.toString(CryptoJS.enc.Utf8)
				Vue.prototype.$dataRole = JSON.parse(originalRoles)
			}else{
				Vue.prototype.$dataRole = ""
			}

			Vue.prototype.$textMemuatData = "Masih memuat data"
			Vue.prototype.$textErrorNetwork = "Jaringan Bermasalah"
			Vue.prototype.$textError = "Error"
			Vue.prototype.$textTokenExpired = "Token Expired"
			Vue.prototype.$textNodata = "Data tidak ditemukan"
			Vue.prototype.$textNetworkError = "Jaringan Bermasalah"
			Vue.prototype.$textErrorPost = "Gagal menyimpan data"
			Vue.prototype.$textErrorPut = "Gagal mengedit data"
			Vue.prototype.$textErrorDelete = "Gagal menghapus data"
		}else{
			localStorage.clear()
			$cookies.remove(CryptoJS.MD5('id_token').toString())
			$cookies.remove(CryptoJS.MD5('new_dashboard').toString())
			$cookies.keys().forEach(cookie => $cookies.remove(cookie))
			window.location.href = this.buildUrl(false)

			// remove for Cookies base path
			let domainName = process.env.BASE_PATH
			document.cookie = CryptoJS.MD5('id_token').toString() + "=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/; domain="+ domainName +";"
			document.cookie = CryptoJS.MD5('new_dashboard').toString() + "=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/; domain="+ domainName +";"
		}
	},
	getTokenSSO(){
		let url_string = window.location
		let url = new URL(url_string)
		let getToken = url.searchParams.get("token")
		return getToken
	},
	setTokenSSO(){
		let cookieName = CryptoJS.MD5('id_token').toString()
		let cookieNameNewDB = CryptoJS.MD5('new_dashboard').toString()
		let cookieNameDBConfig = CryptoJS.MD5('config_db').toString()
		let domainName = process.env.BASE_PATH
		let cookieValue = this.getTokenSSO()
		let cookieValueNewDB = CryptoJS.MD5('this is new dashboard OwO...').toString()
		let cookieValueDBConfig = CryptoJS.MD5('db_config').toString()
		let myDate = new Date()
		myDate.setMonth(myDate.getMonth() + 12)
		document.cookie = cookieName + "=" + cookieValue + ";expires=" + myDate + ";path=/"
		document.cookie = cookieNameNewDB + "=" + cookieValueNewDB + ";expires=" + myDate + ";path=/"
		document.cookie = cookieNameDBConfig + "=" + cookieValueDBConfig + ";expires=" + myDate + ";path=/"
	}
}
