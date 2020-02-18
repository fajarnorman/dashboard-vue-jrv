<template>
    <div class="content-wrapper">
        <div id="profile-page">
            <div class="content">
                <el-alert
                    v-if="messagesuccess"
                    title=""
                    type="success"
                    :description="messagesuccess"
                    show-icon></el-alert>
				<div class="list-data">
					<el-row :gutter="20">
						<el-col :span="10" :xs="24">
							<h5>Profile</h5>
						</el-col>
						<el-col :span="14" :xs="24">
							<div class="cards profile-page" v-if="itemsData">
								<el-row :gutter="20">
									<el-col :span="10">
										<img :src="itemsData.picture_url" class="img-profile">
										<el-button @click.prevent="dialogUser = true" round type="primary" id="signin" class="button-white-green change-password">Change Password</el-button>
									</el-col>
									<el-col :span="14">
										<div class="desc-profile">
											<div class="list-profile">
												<span>Nama : </span>
												<div class="value">{{itemsData.fullname}}</div>
											</div>
											<div class="list-profile">
												<span>Email : </span>
												<div class="value"><a :href="'mailto:'+itemsData.email">{{itemsData.email}}</a></div>
											</div>
											<div class="list-profile">
												<span>Permission : </span>
												<div class="value">
													<div v-if="itemsData.roles">
														<div
															v-for="(dataRoles, indexRoles) in itemsData.roles"
															:key="indexRoles">
															{{dataRoles.name}},
														</div>
													</div>
												</div>
											</div>
										</div>
									</el-col>
								</el-row>
							</div>
						</el-col>
					</el-row>
				</div>
				<el-dialog
                    title="Change Password"
                    :visible.sync="dialogUser"
                    width="35%"
                    top="5vh"
                    :modal-append-to-body="false"
                    class="mb-dialog nopadding-right point-modal kepala-regional">
                    <div class="content-dialog detail-pencapaian">
                        <el-form :model="forms" :rules="rules" status-icon ref="formsvalid" label-width="120px" class="demo-ruleForm">
                            <div class="item-forms-details">
                                <div class="forms-details">
									<el-row :gutter="20">
										<el-col :span="24">
											<el-form-item label="New Password" prop="password">
												<el-input type="password" v-model="forms.password"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="24">
											<el-form-item label="Repeat Password" prop="rpassword">
												<el-input type="password" v-model="forms.rpassword"></el-input>
											</el-form-item>
										</el-col>
									</el-row>
								</div>
                            </div>
                        </el-form>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button id="save-change-password" round class="button-white-green" @click.prevent="submitSave('formsvalid')" type="primary">Confirm</el-button>
                    </span>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import pageHeader from '@/components/pageHeader'
import loadingSvg from '@/components/loadingSvg'

export default {
    name: 'profile-setting',
    components: { pageHeader, loadingSvg },
    data(){
		var validatePass = (rule, value, callback) => {
            if(value === ''){
                callback(new Error('Please input the password'))
            }else{
                if(this.forms.rpassword !== ''){
                    this.$refs.formsvalid.validateField('rpassword')
                }
                callback()
            }
        }
        var validatePass2 = (rule, value, callback) => {
            if(value === ''){
                callback(new Error('Please input the password'))
            }else if(value !== this.forms.password){
                callback(new Error('Password inputs don\'t match!'))
            }else{
                callback()
            }
        };
        return{
			sectionApi: "info",
			sectionApiUser: "user",
            loading: false,
            loadingUser: false,
            itemsData: [],
			itemsDataUser: [],
			itemDataUserDetail: [],
			dialogUser: false,
			messagesuccess: "",
			forms: {
				password: "",
				rpassword: "",
			},
			rules: {
				password: [ { validator: validatePass, trigger: 'blur' } ],
                rpassword: [ { validator: validatePass2, trigger: 'blur' } ],
			}
        }
    },
    created(){
        this.$FUNCTIONS.checkPermissions(this.$dataRole['.cms.brand.get'])
    },
    mounted(){
		this.getPost()
    },
    watch: {
        searchQuery: function(){
            this.getResult()
            this.$FUNCTIONS.checkPaginations()
        }
    },
    methods:{
        buildUrl(value){
            if(value == true){
                return this.$baseUrl + this.sectionApiUser + "?limit=1000&page=1"
            }else{
                return this.$baseUrl + this.sectionApi
            }
		},
		searchArray(nameKey, myArray){
			for (var i=0; i < myArray.length; i++) {
				if (myArray[i].email === nameKey) {
					return myArray[i];
				}
			}
		},
        async getPost(){
            try{
                this.loading = true
                const response = await this.$services.getList(this.buildUrl(false))
                this.loading = false
                if(response.status == 200){
					this.itemsData = response.data
					this.getPostUser()
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
		},
		async getPostUser(){
            try{
                this.loadingUser = true
                const response = await this.$services.getList(this.buildUrl(true))
                this.loadingUser = false
                if(response.status == 200){
					this.itemsDataUser = response.data.data
					this.itemDataUserDetail = this.searchArray(this.itemsData.email, this.itemsDataUser)
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
        },
        async postFunction(type, credentials, url) {
            if(type == "put"){
                try{
                    const response = await this.$services.putList(url, credentials)
                    document.getElementById("save-change-password").children[0].innerHTML = "Simpan"
                    if(response.status == 200) {
						this.messagesuccess = 'Password berhasil di update'
						this.dialogUser = false
						this.forms.password = ''
						this.forms.rpassword = ''
                        this.getPost()
                    }else{
                        this.$FUNCTIONS.notify('error', 'Error', this.$textErrorPut)
                    }
                }catch(err){
                    this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
                }
            }else if (type == "delete"){
                try{
                    const response = await this.$services.deleteList(url)
                    if(response.status == 200) {
                        this.messagesuccess = this.textDataDeleteSuccess
                        this.getPost()
                        this.closeModal()
                    }else{
                        this.$FUNCTIONS.notify('error', 'Error', this.$textErrorDelete)
                    }
                }catch(err){
                    this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
                }
            }
        },
        submitSave(formName) {
			let loadingform = this.$FUNCTIONS.svgSpinner
            this.messagesuccess = ""
			this.messageerror = ""
            this.$refs[formName].validate(valid => {
                if (valid) {
					document.getElementById('save-change-password').children[0].innerHTML = loadingform
					let dataValue = {
						fullname: this.itemDataUserDetail.fullname,
						email: this.itemDataUserDetail.email,
						password: this.forms.password,
						rpassword: this.forms.rpassword,
					}
					let urlv = this.$baseUrl + this.sectionApiUser + "/" + this.itemDataUserDetail.id
					this.postFunction("put", dataValue, urlv)
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
#profile-page{
	.list-data{
		padding: 24px 0;
		border-top: 1px solid #dfe4e8;
		span{
			display: block;
			margin-bottom: 5px;
			color: #697586;
			font-size: 14px;
		}
		.badge{
			display: inline-block;
			margin-top: 5px;
		}
		b{
			font-size: 16px;
			text-transform: capitalize;
		}
		h5{
			color: #39434e;
			font-size: 16px;
			margin-top: 20px;
		}
		.cards{
			p{
				white-space: pre-line;
				margin-top: 0;
				margin-bottom: 0;
			}
			ul{
				list-style: none;
				padding: 0;
				&:after{
					clear: both;
					content: '';
					display: block;
				}
				li{
					float: left;
					width: 50%;
					padding: 0 15px;
					color: #697586;
					font-size: 14px;

				}
			}
		}
	}
	.profile-page{
		background: #fff;
		padding: 20px;
		border-radius: 5px;
		position: relative;
		.change-password{
			margin-top: 15px;
			display: block;
			width: 100%;
		}
		.img-profile{
			max-width: 200px;
			display: block;
    		margin: 0 auto;
		}
		.desc-profile{
			margin-top: 25px;
    		margin-left: 25px;
		}
		.list-profile{
			margin-bottom: 25px;
			span{
				font-weight: bold;
			}
		}
	}
}
</style>
