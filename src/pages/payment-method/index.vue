<template>
	<div class="content-wrapper">
		<div id="payment-method">
			<page-header titleName="Payment Method" :isCreate="true"></page-header>
			<div class="content">
				<div class="content-userMenu">
					<el-row :gutter="20">
						<el-col :span="12" style="position: relative;">
							<loading-svg :isLoading="loading"></loading-svg>
							<div v-if="messagesuccess !== ''">
								<el-alert title="" type="success" :description="messagesuccess" show-icon></el-alert>
							</div>
							<div class="content-user-drags-new" v-if="(itemsData).length !== 0">
								<div
									v-for="(dataCat, indexCat) in itemsData"
									:key="indexCat"
									class="item-kategori">
									<div class="item-home-page">
										<div class="item-home-content clearfix">
											<h5 class="float-left">
												<a href="#" @click.prevent="" :dataId="dataCat.id" class="handle-sort-new">
													<font-awesome-icon class="fontIcons" :icon="fontsIcons.drags" />
												</a>
												{{dataCat.name}}
												<span class="inline badge success" v-if="dataCat.status == 'active'">{{dataCat.status}}</span>
												<span class="inline badge failed" v-else>{{dataCat.status}}</span>
											</h5>
											<div class="actions-buttons float-right">
												<el-tooltip class="item" effect="dark" content="Edit Payment Tipe" placement="top">
													<a @click.prevent="handleCurrentChange('menu-edit', dataCat)" style="margin-right: 10px;">
														<font-awesome-icon class="fontIcons" :icon="fontsIcons.edit" />
													</a>
												</el-tooltip>
												<el-tooltip class="item" effect="dark" content="Create Payment Method" placement="top">
													<a @click.prevent="handleCurrentChange('payment-method-create', dataCat)" style="margin-right: 10px;">
														<font-awesome-icon class="fontIcons" :icon="fontsIcons.create" />
													</a>
												</el-tooltip>
											</div>
										</div>
										<div class="content-user-drags">
											<div class="item-menu-home-cat"
												v-for="(dataCatMenu, indexCatMenu) in dataCat.methods"
												:key="'cat-home'+indexCatMenu">
												<div class="item-head clearfix">
													<h5 class="float-left">
														<a href="#" @click.prevent="" :dataId="dataCatMenu.id" class="handle-sort"><font-awesome-icon class="fontIcons" :icon="fontsIcons.drags" /></a>
														{{dataCatMenu.name}}
														<span class="inline badge success" v-if="dataCatMenu.status == 'active'">{{dataCatMenu.status}}</span>
														<span class="inline badge failed" v-else>{{dataCatMenu.status}}</span>
													</h5>
													<div class="actions-buttons float-right">
														<el-tooltip class="item" effect="dark" content="Edit Payment Method" placement="top">
															<a @click.prevent="handleCurrentChange('payment-method-edit', dataCatMenu)" style="margin-right: 10px;">
																<font-awesome-icon class="fontIcons" :icon="fontsIcons.edit" />
															</a>
														</el-tooltip>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="content-user-drags" v-else>
								<div class="nodatas">No Data available</div>
							</div>
						</el-col>
					</el-row>
				</div>

				<div class="base-template-sidebar">
                    <loading-svg :isLoading="loadingForm"></loading-svg>
                    <div class="content" v-if="itemDataDetail">
                        <header class="clearfix">
                            <h4>{{titleForms}}</h4>
                            <el-button id="cancel" @click="closeModal()"><img :src="require('@/assets/images/icons/big-close.png')"></el-button>
                        </header>
                        <section>
                            <el-form :model="forms" status-icon :rules="rules" ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                <div class="item-forms-details">
                                    <div class="forms-details">
                                        <el-row :gutter="20">
											<el-col :span="24">
                                                <el-form-item label="Nama" prop="name">
													<el-input v-model="forms.name"></el-input>
												</el-form-item>
											</el-col>
											<el-col :span="24">
                                                <el-form-item label="Status">
													<el-radio-group v-model="forms.status">
														<el-radio label="active">Active</el-radio>
														<el-radio label="inactive">Inactive</el-radio>
													</el-radio-group>
												</el-form-item>
											</el-col>
											<div v-if="!isPaymentType">
												<el-col :span="12">
													<el-form-item label="Slug" prop="slug">
														<el-input v-model="forms.slug"></el-input>
													</el-form-item>
												</el-col>
												<el-col :span="12">
													<el-form-item label="Payment Tipe">
														<el-select v-model="forms.payment_type_id">
															<el-option
																v-for="(dataPayment, indexPayment) in itemsData"
																:key="indexPayment"
																:label="dataPayment.name"
																:value="dataPayment.id"></el-option>
														</el-select>
													</el-form-item>
												</el-col>
												<el-col :span="24">
													<el-form-item label="Payment Channel">
														<el-radio-group @change="paymentChannelChange" v-model="forms.payment_channel">
															<el-radio label="non-credit">Non-Credit</el-radio>
															<el-radio label="credit">Credit</el-radio>
														</el-radio-group>
													</el-form-item>
												</el-col>
												<div v-if="forms.payment_channel === 'credit'">
													<el-col :span="12">
														<el-form-item label="Interest Type" prop="interest_type">
															<el-select v-model="forms.interest_type">
																<el-option value="fixed" label="Fixed"></el-option>
																<el-option value="percentage" label="Percentage"></el-option>
															</el-select>
														</el-form-item>
													</el-col>
													<el-col :span="12">
														<el-form-item label="Interest Rate" prop="interest_rate">
															<el-input type="number" v-model="forms.interest_rate"></el-input>
														</el-form-item>
													</el-col>
													<el-col :span="12">
														<el-form-item label="DP Type" prop="dp_type">
															<el-select v-model="forms.dp_type">
																<el-option value="none" label="None"></el-option>
																<el-option value="fixed" label="Fixed"></el-option>
																<el-option value="percentage" label="Percentage"></el-option>
															</el-select>
														</el-form-item>
													</el-col>
													<el-col :span="12">
														<el-form-item label="DP Rate" prop="dp_rate">
															<el-input v-model="forms.dp_rate" type="number"></el-input>
														</el-form-item>
													</el-col>
												</div>
												<el-col :span="24">
													<el-form-item label="Icon" prop="files">
														<form ref="fileform" class="fileForm">
															<div class="custom-upload-images">
																<div class="img-first-step" v-show="(progressFirst == false)">
																	<span class="img-upload-tittle"><img :src="require('@/assets/images/icons/image.png')"></span>
																	<div class="text"><a href="#" @click.prevent="uploadTrigger">Browse Images</a></div>
																	<input type="file" id="imagesIcons" accept="image/x-png,image/gif,image/jpeg" @change="handleUpload" class="custom-upload-tag">
																</div>
																<div class="progressbar-content" v-show="(progressShow == true)">
																	<h4>Uploading your image</h4>
																	<div class="progressbar">
																		<div class="myBar" id="myBar"></div>
																	</div>
																	<div class="file-info">
																		<span class="percentage"></span> of {{formatBytes(forms.files.size)}} uploaded
																	</div>
																</div>
																<div class="result-upload-img" v-show="(doneProgress == true)">
																	<div class="file-listing">
																		<img class="preview" id="previews" v-bind:ref="'preview'"/>
																		<span v-if="forms.files">{{ forms.files.name }}</span>
																		<div class="status-container" @click.prevent="uploadTrigger">Edit</div>
																	</div>
																</div>
															</div>
														</form>
													</el-form-item>
												</el-col>
											</div>
                                        </el-row>
                                    </div>
                                </div>
                            </el-form>
                        </section>
                    </div>
                    <div class="actions-button clearfix">
						<el-button v-show="(formsType == 'edit')" class="button-outline-black" id="trash" @click.prevent="deletePost(itemDataDetail.id)">
                            <img :src="require('@/assets/images/icons/trash.png')" alt="img-trash">
                        </el-button>
                        <el-button class="button-outline-black" @click="closeModal()">Batal</el-button>
                        <el-button v-show="(formsType != 'edit')" class="button-white-green" id="save" @click.prevent="submitSave('formsvalid', 'save')">Simpan</el-button>
						<el-button v-show="(formsType == 'edit')" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button>
                    </div>
                </div>
			</div>
		</div>
	</div>
</template>

<script>
import JQuery from 'jquery'
import SortTable from 'sortablejs'
import pageHeader from '@/components/pageHeader'
import loadingSvg from '@/components/loadingSvg'
import {
    faEdit,
    faPlusCircle,
    faPencilAlt,
    faArrowsAlt,
    faSortAmountDown,
    faHeart,
    faStar,
    faTimes
} from '@fortawesome/free-solid-svg-icons'

export default {
    name: 'payment-method',
    components: { pageHeader, loadingSvg },
    data(){
		var validatePaymentChannel = (rule, value, callback) => {
			if(this.forms.payment_channel == 'credit'){
				if(value === ''){
					callback(new Error('Inputan harus diisi'))
				}else{
					callback();
				}
			}else{
				callback();
			}
		}
        return{
			sectionApi: "paymentType",
			sectionApiMethod: "paymentMethod",
			sectionApiSorting: "/sorting",
			itemsData: [],
			itemsDataPaymentMethod: [],
			itemDataDetail: [],
			loading: false,
			loadingForm: false,
            titleForms: "",
            formsType: "",
            messagesuccess: "",
			messageerror: "",
			isPaymentType: true,
			dataSortTable: "",
			isSortingUpdate: false,
			forms: {
				name: '',
				status: 'active',
				slug: '',
				icon: '',
				payment_channel: 'non-credit',
				payment_type_id: '',
				files: '',
				filesEdit: '',
				interest_type: '',
				interest_rate: '',
				dp_type: '',
				dp_rate: '',
			},
			rules: {
				name: [ { required: true, message: "Inputan Harus diisi", trigger: "blur" } ],
				slug: [ { required: true, message: "Inputan Harus diisi", trigger: "blur" } ],
				files: [ { required: true, message: "Inputan Harus diisi", trigger: "change" } ],
				interest_type: [ { validator: validatePaymentChannel, trigger: 'blur' } ],
				interest_rate: [ { validator: validatePaymentChannel, trigger: 'blur' } ],
				dp_type: [ { validator: validatePaymentChannel, trigger: 'blur' } ],
				dp_rate: [ { validator: validatePaymentChannel, trigger: 'blur' } ],
			},
			fontsIcons: {
                edit: faEdit,
                editv2: faPencilAlt,
                create: faPlusCircle,
                drags: faArrowsAlt,
                sorts: faSortAmountDown,
                favorite: faStar,
                delete: faTimes
            },
			dataTextCreate: "Buat Payment Tipe",
            dataTextUpdate: "Edit Payment Tipe",
            confirmDescDelete: 'Anda yakin akan menghapus data dari daftar?',
            confirmTitleDelete: 'Hapus data?',
            textDataCreateSuccess: "Data Payment Tipe Berhasil ditambahkan.",
			textDataUpdateSuccess: "Data Payment Tipe Berhasil diupdate.",
			textDataDeleteSuccess: "1 Items Berhasil dihapus.",
			// images
            progressShow: false,
            doneProgress: false,
            progressFirst: false,
            dragAndDropCapable: false,
			uploadPercentage: 0,
		}
	},
	created(){
        this.$FUNCTIONS.checkPermissions(this.$dataRole['.cms.paymenttype.get'])
    },
    mounted(){
		this.initCreateFunction()
		this.getPost()
	},
	methods: {
		buildUrl(value, withParameter){
			if(value){
				if(withParameter){
					return this.$baseUrl + this.sectionApi + "?limit=50&page=1"
				}else{
					return this.$baseUrl + this.sectionApi
				}
			}else{
				if(withParameter){
					return this.$baseUrl + this.sectionApiMethod + "?limit=50&page=1"
				}else{
					return this.$baseUrl + this.sectionApiMethod
				}
			}
		},
		buildUrlSorting(value){
			return this.buildUrl(value, false) + this.sectionApiSorting
		},
		async getPost(){
            try{
				this.itemsData = []
                this.loading = true
                const response = await this.$services.getList(this.buildUrl(true, true))
				this.loading = false
				this.isSortingUpdate = false
                if(response.status == 200){
					this.itemsData = response.data.data
					let that = this
					const sortItem = () => this.sortsItems()
					setTimeout(sortItem, 500)
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
		},
		async postFunction(type, credentials, url) {
            if(type == "post"){
                try{
                    const response = await this.$services.postList(url, credentials)
                    document.getElementById("save").children[0].innerHTML = "Simpan"
                    if(response.status == 201) {
                        this.messagesuccess = this.textDataCreateSuccess
                        this.getPost()
                        this.closeModal()
                    }else{
                        this.$FUNCTIONS.notify('error', 'Error', this.$textErrorPost)
                    }
                }catch(err){
                    this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
                }
            }else if(type == "put"){
                try{
                    const response = await this.$services.putList(url, credentials)
                    document.getElementById("save-edit").children[0].innerHTML = "Simpan"
                    if(response.status == 200) {
						this.messagesuccess = this.textDataUpdateSuccess
						if(this.isSortingUpdate){
							let that = this
							setTimeout(() => {
								that.getPost()
							}, 500)
						}else{
							this.getPost()
						}
                        this.closeModal()
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
            }else if(type == "detail"){
                try{
                    this.loadingForm = true
                    const response = await this.$services.getList(url)
                    this.loadingForm = false
                    if(response.status == 200){
						this.itemDataDetail = response.data
						if(this.isPaymentType){
							this.forms.name = this.itemDataDetail.name
							this.forms.status = this.itemDataDetail.status
						}else{
							this.forms.name = this.itemDataDetail.name
							this.forms.status = this.itemDataDetail.status
							this.forms.slug = this.itemDataDetail.slug
							this.forms.payment_type_id = this.itemDataDetail.payment_type_id
							this.forms.payment_channel = this.itemDataDetail.payment_channel
							this.forms.interest_type = this.itemDataDetail.interest_type
							this.forms.interest_rate = this.itemDataDetail.interest_rate
							this.forms.dp_type = this.itemDataDetail.dp_type
							this.forms.dp_rate = this.itemDataDetail.dp_rate
							if(this.itemDataDetail.logo_url !== null){
								let url = this.itemDataDetail.logo_url
								let filename = url.substring(url.lastIndexOf('/')+1);
								this.$refs['preview'].src = this.itemDataDetail.logo_url
								this.forms.files = { name: filename }
								this.progressFirst = true
								this.doneProgress = true
							}
						}
                    }else if(response.status == 400){
                        this.$FUNCTIONS.logout("expired-token", this.$textTokenExpired)
                    }else{
                        this.$FUNCTIONS.notify("error", "Error", this.$textNodata)
                    }
                }catch(err){
                    this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
                }
            }
		},
		submitSave(formName, formtype) {
            let loadingform = this.$FUNCTIONS.svgSpinner
            this.messagesuccess = ""
			this.messageerror = ""
			let urlLink = (this.isPaymentType) ? this.buildUrl(true, false) : this.buildUrl(false, false)
			let formData
			if(!this.isPaymentType){
				formData = new FormData()
				formData.append('name', this.forms.name)
				formData.append('status', this.forms.status)
				formData.append('slug', this.forms.slug)
				formData.append('payment_type_id', this.forms.payment_type_id)
				formData.append('payment_channel', this.forms.payment_channel)
				formData.append('interest_type', this.forms.interest_type)
				formData.append('interest_rate', this.forms.interest_rate)
				formData.append('dp_type', this.forms.dp_type)
				formData.append('dp_rate', this.forms.dp_rate)
				if(this.forms.files !== '' && this.forms.files['type'] != undefined){
					formData.append('icon', this.forms.files)
				}
			}else{
				formData = {
					name: this.forms.name,
					status: this.forms.status
				}
			}
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if(formtype == "save") {
						document.getElementById("save").children[0].innerHTML = loadingform
                        this.postFunction("post", formData, urlLink)
                    }else{
						document.getElementById("save-edit").children[0].innerHTML = loadingform
                        this.postFunction("put", formData, urlLink + "/" + this.itemDataDetail.id)
                    }
                }
            })
		},
		handleCurrentChange(type, val) {
            if(val) {
				if(type == 'menu-edit'){
					this.titleForms = 'Edit Payment Tipe'
                    this.formsType = 'edit'
                    this.loadingForm = false
                    let url = this.buildUrl(true, false) + "/" + val.id
                    this.isPaymentType = true
                    this.$FUNCTIONS.sidebarToggle(true)
					this.postFunction('detail', '', url)
				}else if(type == 'payment-method-create'){
					this.titleForms = 'Buat Payment Method'
                    this.formsType = 'create'
                    this.loadingForm = false
                    this.isPaymentType = false
					this.$FUNCTIONS.sidebarToggle(true)
					this.forms.payment_type_id = val.id
				}else if(type == 'payment-method-edit'){
					this.titleForms = 'Edit Payment Method'
					this.formsType = 'edit'
					this.loadingForm = false
					let url = this.buildUrl(false, false) + "/" + val.id
                    this.isPaymentType = false
                    this.$FUNCTIONS.sidebarToggle(true)
					this.postFunction('detail', '', url)
				}
            }
        },
		initCreateFunction() {
            let that = this
            setTimeout(function() {
                document.querySelector(".add-click-forms").addEventListener("click", function() {
                    if(that.loading == false){
                        that.titleForms = that.dataTextCreate
						that.formsType = "create"
						that.isPaymentType = true
                        that.$FUNCTIONS.sidebarToggle(true)
                    }else{
                        that.$FUNCTIONS.notify('warning', 'Maaf', that.$textMemuatData)
                    }
                })
            }, 500)
		},
		closeModal(){
			this.$FUNCTIONS.sidebarToggle(false)
			this.forms.name = ''
			this.forms.status = 'active'
			this.forms.slug = ''
			this.forms.icon = ''
			this.forms.payment_type_id = ''
			this.forms.files = ''
			this.forms.filesEdit = ''
			this.forms.payment_channel = 'non-credit'
			this.forms.interest_type = ''
			this.forms.interest_rate = ''
			this.forms.dp_type = ''
			this.forms.dp_rate = ''
			this.progressShow = false
            this.doneProgress = false
            this.progressFirst = false
			if(document.getElementById('imagesIcons')){
                document.getElementById('imagesIcons').value = ""
            }
		},
		sortsItems(){
			let that = this
			var el = document.querySelector('.content-user-drags-new')
			this.dataSortTable = SortTable.create(el,{
				animation: 150,
				handle: '.handle-sort-new',
				group: 'a',
				ghostClass: 'ghost',
				forceFallback: true,
				scroll: true,
				bubbleScroll: true,
				onEnd: function (evt) {
					var itemEl = evt.item;
					var newIndexs = evt.newIndex
					var dataID = itemEl.children[0].children[0].children[0].children[0].getAttribute("dataId")
					that.updatePosition('payment-type' , dataID, newIndexs)
				},
			})

			var el2 = document.querySelectorAll('.content-user-drags')
			el2.forEach(function(e){
				that.dataSortTable = SortTable.create(e,{
					animation: 150,
					handle: '.handle-sort',
					group: 'a',
					ghostClass: 'ghost',
					forceFallback: true,
					scroll: true,
					bubbleScroll: true,
					onEnd: function (evt) {
						var itemEl = evt.item;
						var newIndexs = evt.newIndex
						var dataID = itemEl.children[0].children[0].children[0].getAttribute("dataId")
						that.updatePosition('payment-method' , dataID, newIndexs)
					},
				})
			})
		},
		deletePost(id){
			this.$confirm(this.confirmDescDelete, this.confirmTitleDelete, {
				confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
				this.loading = true
				let urlLink = (this.isPaymentType) ? this.buildUrl(true, false) : this.buildUrl(false, false)
				this.postFunction('delete', '', urlLink + '/' + id)
			})
		},
		updatePosition(type, id, value){
			if(type == 'payment-type'){
				this.loading = true
				this.isSortingUpdate = true
				this.postFunction('put', { id: id, sorting: value }, this.buildUrlSorting(true))
			}else if(type == 'payment-method'){
				this.loading = true
				this.isSortingUpdate = true
				this.postFunction('put', { id: id, sorting: value }, this.buildUrlSorting(false))
			}
		},
		orderedPaymentMethod(value){
			return _.orderBy(value, 'sorting')
		},
		paymentChannelChange(value){
			if(value === 'non-credit'){
				this.forms.interest_type = 'percentage'
				this.forms.interest_rate = 0
				this.forms.dp_type = 'percentage'
				this.forms.dp_rate = 0
			}
		},

		// images
        uploadTrigger(){
            if(document.querySelector('.custom-upload-tag').length != 0){
                document.querySelector('.custom-upload-tag').click('click')
            }
        },
        handleUpload(event){
            if ( /\.(jpe?g|png|gif)$/i.test( event.target.files[0].name ) ) {
				this.forms.files = event.target.files[0]
				this.progressFirst = true
				this.move()
            }else{
                this.$message.error('Maaf, yang boleh di upload hanya images');
            }
        },
        getImagePreviews(){
            if ( /\.(jpe?g|png|gif)$/i.test( this.forms.files.name ) ) {
                let reader = new FileReader();
                reader.addEventListener("load", function(){
                    this.$refs['preview'].src = reader.result;
                }.bind(this), false);
                reader.readAsDataURL( this.forms.files);
            }
        },
        formatBytes(bytes,decimals) {
            if(bytes == 0) return '0 Bytes';
            var k = 1024,
                dm = decimals || 2,
                sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        },
        move() {
            let elem = document.getElementById("myBar");
            let percentageTag = document.querySelector('.file-info .percentage');
            let that = this
            let width = 1;
            this.progressShow = true
            this.doneProgress = false
            let id = setInterval(frame, 10);
            function frame() {
                if (width >= 100) {
                    clearInterval(id);
                    that.getImagePreviews()
                    that.progressShow = false
                    that.doneProgress = true
                } else {
                    width++;
                    percentageTag.innerHTML = width + '%'
                    elem.style.width = width + '%';
                }
            }
        },
        dragInit(){
            this.dragAndDropCapable = this.determineDragAndDropCapable();
            if( this.dragAndDropCapable ){
                ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach( function( evt ) {
                    this.$refs.fileform.addEventListener(evt, function(e){
                        if(evt == 'dragenter'){
                            document.querySelector('.fileForm').classList.add("dragging");
                        }
                        if(evt == 'drop'){
                            document.querySelector('.fileForm').classList.remove("dragging");
                        }
                        e.preventDefault();
                        e.stopPropagation();
                    }.bind(this), false);
                }.bind(this));

                this.$refs.fileform.addEventListener('drop', function(e){
                    if ( /\.(jpe?g|png|gif)$/i.test( e.dataTransfer.files[0].name ) ) {
                        if(e.dataTransfer.files[0].size < 512000){
                            this.forms.files = e.dataTransfer.files[0];
                            this.progressFirst = true
                            this.move()
                        }else{
                            this.$message.error('Maaf, Ukuran Images tidak boleh lebih dari 512KB');
                        }
                    }else{
                        this.$message.error('Maaf, yang boleh di upload hanya images');
                    }
                }.bind(this));
            }
        },
        determineDragAndDropCapable(){
            var div = document.createElement('div');
            return ( ( 'draggable' in div )
                    || ( 'ondragstart' in div && 'ondrop' in div ) )
                    && 'FormData' in window
                    && 'FileReader' in window;
        }
	},
}
</script>
<style lang="scss" scoped>
.filterManageMenu{
    margin-bottom: 15px;
}
.incrementAdditionalData{
    position: absolute;
    left: 8em;
    top: -35px;
    z-index: 10;
    svg{
        font-size: 18px;
    }
}
.nodatas{
    text-align: center;
    font-weight: 600;
    padding: 20px;
    background: #fff;
    border-radius: 4px;
    border: 1px solid #DFE4E8;
}
.item-kategori{
    background: #fff;
    padding: 10px;
    margin-bottom: 15px;
    border-radius: 4px;
    border: 1px solid #DFE4E8;
	.item-home-page{
		.item-menu-home-cat{
			margin-left: 25px;
			border: 1px solid #ddd;
			padding: 9px 10px 10px;
			border-radius: 5px;
			margin-top: 15px;
		}
	}
    .actions-buttons{
        .fontIcons{
            font-size: 13px;
        }
    }
    &:last-child{
        margin-bottom: 0;
    }
    h5{
        padding: 0;
        margin: 0;
        margin-top: 3px;
        font-size: 13px;
        span{
            margin-top: -3px;
            margin-left: 5px;
            font-size: 10px;
            padding: 0px 11px;
            line-height: 21px;
            height: 21px;
        }
        .handle-sort, .handle-sort-new{
            margin-right: 5px;
            top: -1px;
            position: relative;
            font-size: 13px;
        }
    }
    .content-items{
        ul{
            list-style: none;
            padding: 0;
            padding-left: 25px;
            margin-top: 15px;
            margin-bottom: 0;
            li{
                background: #fafafa;
                border-radius: 4px;
                margin-bottom: 10px;
                padding: 7px 12px;
                border: 1px solid #DFE4E8;
                .handle-sort-insidemenu{
                    margin-right: 5px;
                    position: relative;
                    top: -1px;
                }
                span{
                    margin-top: 2px;
                    font-size: 12px;
                }
                .actions-button{
                    text-align: left;
                    & > span{
                        font-size: 10px;
                        vertical-align: middle;
                    }
                    .fontIcons{
                        font-size: 12px;
                    }
                }
                .el-checkbox{
                    margin-bottom: 0;
                }
                &:last-child{
                    margin-bottom: 0;
                }
            }
        }
    }
}
</style>

