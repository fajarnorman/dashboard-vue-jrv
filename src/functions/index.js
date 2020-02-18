import Vue from 'vue'
import VueCookies from 'vue-cookies'
import CryptoJS from 'crypto-js'
import axios from 'axios'
import SSO from './sso'
import { Notification } from 'element-ui'
Vue.use(VueCookies)

export default {
    svgSpinner: '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>',
    textErrorNetwork: "Jaringan Bermasalah",
	textTokenExpired: "Token Expired",
	textNodata: "Data tidak ditemukan",
	configAxios(){
		axios.defaults.withCredentials = false
		axios.defaults.proxyHeaders = false
		let date = new Date()
		let getDate = this.formatDate(date) + " " + this.formatTime(date)
		axios.defaults.headers.common['X-Jarvis-Timestamp'] = getDate
		axios.defaults.headers.common['X-Jarvis-Signature'] = CryptoJS.HmacSHA256(getDate, 'jarvis-secret').toString()
		if(this.getAuthHeader() !== false){
			axios.defaults.headers.common['Authorization'] = this.getAuthHeader().Authorization
		}
	},
    logout(type, notif) {
		$cookies.remove(CryptoJS.MD5('id_token').toString())
		$cookies.remove(CryptoJS.MD5('new_dashboard').toString())
		$cookies.keys().forEach(cookie => $cookies.remove(cookie))
		// remove for Cookies base path
		let domainName = process.env.BASE_PATH
		document.cookie = CryptoJS.MD5('id_token').toString() + "=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/; domain="+ domainName +";"
		document.cookie = CryptoJS.MD5('new_dashboard').toString() + "=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/; domain="+ domainName +";"
        localStorage.clear()
        window.location.href = SSO.buildUrl(false)
        if(type == 'expired-token'){
            localStorage.setItem('logout-message', notif)
        }
	},
    getAuthHeader() {
        if($cookies.get(CryptoJS.MD5('id_token').toString())){
            return {
                'Authorization': 'Bearer ' + $cookies.get(CryptoJS.MD5('id_token').toString())
            }
        }else{
            return false
        }
	},
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    },
    formatTime(time){
        var t = new Date(time),
            hours = '' + t.getHours(),
            minute = '' + t.getMinutes(),
            seconds = '' + t.getSeconds()
            hours = ("0" + hours).slice(-2);
            minute = ("0" + minute).slice(-2);
            seconds = ("0" + seconds).slice(-2);

        return [hours, minute, seconds].join(':');
    },
    formatTimeUTC(time){
        var t = new Date(time),
            hours = '' + t.getUTCHours(),
            minute = '' + t.getUTCMinutes(),
            seconds = '' + t.getUTCSeconds()
            hours = ("0" + hours).slice(-2);
            minute = ("0" + minute).slice(-2);
            seconds = ("0" + seconds).slice(-2);

        return [hours, minute, seconds].join(':');
    },
    triggerBackdropClick(){
        document.querySelector('.backdrop').addEventListener("click", function(){
            document.getElementById("cancel").click();
        });
    },
    sidebarToggle(value){
        if(value == true){
            document.querySelector('.base-template-sidebar').classList.add('showing')
            document.querySelector('.backdrop').classList.add('show')
            document.querySelector('body').classList.add('no-scroll')
        }else{
            document.querySelector('.base-template-sidebar').classList.remove('showing')
            document.querySelector('.backdrop').classList.remove('show')
            document.querySelector('body').classList.remove('no-scroll')
        }
    },
    notify(type, title, message){
        Notification({
            title: title,
            message: message,
            type: type
        });
        // if(message == 'Akses ditolak!'){
        //     window.location.href = '#reload'
        // }
    },
    checkPermissions(valuePermission){
        // if(valuePermission == false || valuePermission == undefined){
        //     window.location.href = ''
        // }
    },
    formatPrice(value){
        let val = (value/1).toFixed(0).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    checkPaginations(){
        if(document.querySelector('.el-pagination') !== null){
            if(document.querySelector('.el-pagination').children[1].children[0] !== undefined){
                document.querySelector('.el-pagination').children[1].children[0].click()
            }
        }
    },
    viewActive(){
        document.querySelectorAll('.showing-page ul li').forEach(function(a){ a.classList.remove('active') })
        event.target.parentNode.classList.add('active')
    },
    checkErrorResponse(value){
        if(value == 400){
            this.logout("expired-token", this.textTokenExpired)
        }else{
            this.notify("error", "Error", this.textNodata)
        }
	},
	checkError400Response(text, value){
		if(typeof value === 'string' || value instanceof String){
			if(value == 'Unauthorized'){
				this.logout('expired-token', 'Berhasil Logout')
			}else{
				this.notify("error", text, value)
			}
		}else{
			let dataErrorValue = []
			value.forEach(function(e){
				dataErrorValue.push(e.msg)
			})
			this.notify("error", text, dataErrorValue.join('\r\n'))
		}
	},
    removeDups(names) {
        let unique = {}
        names.forEach(function(i) {
            if(!unique[i]) {
                unique[i] = true
            }
        });
        return Object.keys(unique)
    },
    remove_first_character(element) {
        return element.slice(1)
    },
    remove_last_character(element) {
        return element.slice(0,element.length - 1)
    },
    remove_character(str_to_remove, str) {
        let reg = new RegExp(str_to_remove)
		return str.replace(reg, '')
	},
	dynamicSort(property, order) {
		var sort_order = 1;
		if(order === "desc"){
			sort_order = -1;
		}
		return function (a, b){
			if(a[property] < b[property]){
				return -1 * sort_order
			}else if(a[property] > b[property]){
				return 1 * sort_order
			}else{
				return 0 * sort_order
			}
		}
	}
}
