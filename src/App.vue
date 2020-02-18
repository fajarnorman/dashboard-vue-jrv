<template>
    <div id="app" class="app">
        <div class="backdrop"></div>
        <div v-if="(authenticated == true)">
            <header-component :key="componentKey" :dataUser="dataUser"></header-component>
            <div class="page-container">
                <div class="page-content clearfix">
                    <sidebar-component :key="componentKey" :roles="rolesGet" :valuePermissions="valuePermission"></sidebar-component>
                    <transition name="fade">
                        <router-view></router-view>
                    </transition>
                </div>
            </div>
        </div>
        <div v-else>
            <!-- <div id="login">
                <div class="panel panel-body login-form">
                    <div class="text-center">
                        <div class="icon-object border-slate-300 text-slate-300">
                            <div class="icons" v-html="require('./assets/images/icons/staff.svg')"></div>
                        </div>
                        <h5 class="content-group">Login to your account <small class="display-block">Enter your credentials below</small></h5>
                    </div>
                    <div v-if="errormessage">
                        <el-alert @close="closeMessage" :title="titleError" type="error" :description="errormessage" show-icon></el-alert>
                    </div>
                    <el-form :model="forms" :rules="rules" ref="ruleFormLogin" label-width="120px" class="demo-ruleForm" @submit="login()">
                        <el-form-item label="Email" prop="email">
                            <el-input type="text" v-model="forms.email" placeholder="Enter Email" @keyup.enter.native="login()"></el-input>
                        </el-form-item>
                        <el-form-item label="Password" prop="password">
                            <el-input type="password" v-model="forms.password" placeholder="Enter Password" @keyup.enter.native="login()"></el-input>
                        </el-form-item>
                        <el-button type="primary" id="signin" class="button-white-green" v-on:click.prevent="login()">Sign in</el-button>
                    </el-form>
                </div>
            </div> -->
        </div>
    </div>
</template>

<script>
import HeaderComponent from '@/components/HeaderComponent.vue'
import SidebarComponent from '@/components/SidebarComponent.vue'

export default {
	name: 'app',
	data(){
		return{
			keySecretPrase: '',
			loginUrl: 'login',
			sectionApiInfo: 'info',
			permissionId: this.$getRoles,
			authenticated: false,
			errormessage: '',
			titleError: 'Login',
			forms: {
				email: "",
				password: ""
			},
			rules:{
				email: [ { required: true, message: 'Email kosong', trigger: 'blur' } ],
				password: [ { required: true, message: 'Password kosong', trigger: 'blur' } ],
			},
			dataLogin: [],
			componentKey: 0,
			rolesGet: 0,
			valuePermission: null,
			dataUser: "",
		}
	},
	created () {
		// init for backbutton in mobile
		document.addEventListener("backbutton", this.yourCallBackFunction, false);
	},
	mounted() {
		// Check the users auth status when the app starts
		this.checkAuthentications()

		// Trigger for backdrop click
		this.$FUNCTIONS.triggerBackdropClick()
	},
	methods: {
		yourCallBackFunction(){
			if(document.getElementsByClassName('sidebar')[0].classList.contains('showing')){
				document.getElementsByClassName('sidebar')[0].classList.remove('showing')
			}
			this.$FUNCTIONS.sidebarToggle(false)
		},
		checkAuthentications(){
			if(this.$cookies.get(this.$CryptoJS.MD5('id_token').toString())){
				this.authenticated = true
				this.checkInfoAuth()
				if(this.$cookies.get(this.$CryptoJS.MD5('id_token').toString()) && this.$route.path == '/'){
					this.$router.push({name: 'dashboard-charts'})
				}
				if (performance.navigation.type == 1) {
					console.info( "Permission is loaded" )
				}
			}else{
				if (performance.navigation.type == 1) {
					localStorage.clear()
					this.$cookies.remove(this.$CryptoJS.MD5('id_token').toString())
					this.$cookies.remove(this.$CryptoJS.MD5('new_dashboard').toString())
					console.info( "This page is reloaded" )
				}
			}
		},
		async checkInfoAuth(){
			try{
				let keyPhrase =  process.env.KEY_UNLOCK
				let url = this.$baseUrlAuth + this.sectionApiInfo
				const response = await this.$services.getList(url)

				if(response.status == 200){
					let dataPermission
					let dataPermissionJSON = {}
					let dataRoles = response.data.roles
					this.dataUser = response.data

					if(dataRoles !== null){
						dataRoles.forEach(function(e){
							if(e.permissions !== null){
								dataPermission = e.permissions
							}
						}, this)
						let dataValue = JSON.parse(dataPermission)
						for(var i = 0; i < dataValue.length; i++){
							dataPermissionJSON[dataValue[i]] = true
						}
						this.valuePermission = dataPermissionJSON
						let EncriptPermissions = this.$CryptoJS.AES.encrypt(JSON.stringify(dataPermissionJSON), keyPhrase).toString()
						this.$localStorage.set(this.$CryptoJS.MD5('permission').toString(), EncriptPermissions)
					}

					this.componentKey++
				}else{
					this.$FUNCTIONS.checkErrorResponse(response.status)
				}
			}catch(err){
				this.$FUNCTIONS.notify('error', this.$textNetworkError, err.message)
			}
		}
	},
	components: {HeaderComponent, SidebarComponent}
}
</script>

<style lang="scss">
    #login{
        max-width: 320px;
        width: 100%;
        margin: 0 auto;
        padding: 0;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        transition-delay: 0s !important;
        right: auto;
        .icon-object{
            width: 72px;
            height: 72px;
            margin: 10px auto;
            .icons{
                width: 35px;
                margin: 0 auto;
            }
        }
        .panel{
            padding: 20px;
            box-shadow: 0px 5px 12px rgba(0, 0, 0, 0.2);
            .el-form-item{
                margin-bottom: 15px;
                .el-form-item__error{
                    position: static;
                }
            }
            button{
                width: 100%;
                display: block;
            }
            .content-group{
                margin-bottom: 15px;
                font-size: 14px;
                font-weight: 600;
                small{
                    font-weight: normal;
                    display: block;
                    font-size: 12px;
                    margin-top: 5px;
                }
            }
        }
    }
</style>

<!-- styling for the component -->
<style src="./assets/styles/scss/global.scss" lang="scss"></style>
