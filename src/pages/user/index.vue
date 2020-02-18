<template>
    <div class="content-wrapper">
        <div id="user">
            <div class="page-header">
                <page-header titleName="User" :isCreate="true"></page-header>
            </div>
            <div class="content">
				<div class="filterSearching clearfix">
                    <div class="input-with-icons clearfix">
                        <el-input v-model="searchQuery" class="float-left"></el-input>
                        <img :src="require('@/assets/images/icons/search1.png')">
                    </div>
                </div>
                <el-alert
                    v-if="messagesuccess"
                    title=""
                    type="success"
                    :description="messagesuccess"
                    show-icon></el-alert>
                <el-table
                    :data="itemsData"
                    max-height="530"
                    empty-text="No data available in table"
                    ref="singleTable"
                    @current-change="handleCurrentChange"
                    v-loading="loading"
                    class="mobayar-table">
                    <el-table-column type="index" label="No" width="50"></el-table-column>
                    <el-table-column label="Fullname" prop="fullname"></el-table-column>
                    <el-table-column label="Email" prop="email"></el-table-column>
                    <el-table-column label="Created Update">
                        <template slot-scope="scope">
                            {{scope.row.created_at | moment("YYYY-MM-DD, H:mm:ss")}}
                        </template>
                    </el-table-column>
                    <el-table-column label="Last Update">
                        <template slot-scope="scope">
                            {{scope.row.updated_at | moment("YYYY-MM-DD, H:mm:ss")}}
                        </template>
                    </el-table-column>
                </el-table>
                <div class="mobayar-actions-bottom clearfix">
                    <div class="showing-page float-left">
                        <span>View</span>
                        <ul>
                            <li class="active"><a href="#" @click.prevent="limitChange('10', $event)">10</a></li>
                            <li><a href="#" @click.prevent="limitChange('25', $event)">25</a></li>
                            <li><a href="#" @click.prevent="limitChange('50', $event)">50</a></li>
                            <li><a href="#" @click.prevent="limitChange('100', $event)">100</a></li>
                        </ul>
                    </div>
                    <div class="pagination-result float-right">
                        <span>Showing results 1 - {{itemsData.length}} of {{parseInt(totalPage)}}</span>
                        <el-pagination
                            layout="prev, pager, next"
                            :total="parseInt(totalPage)"
                            @current-change="pageChange"
                            :page-size="parseInt(limit)">
                        </el-pagination>
                    </div>
                </div>
                <div class="base-template-sidebar">
                    <loading-svg :isLoading="loadingForm"></loading-svg>
                    <div class="content" v-if="itemDataDetail">
                        <header class="clearfix">
                            <h4>{{titleForms}}</h4>
                            <el-button @click="closeModal()"><img :src="require('@/assets/images/icons/big-close.png')"></el-button>
                        </header>
                        <section>
                            <el-form :model="forms" status-icon :rules="rules" ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                <div class="item-forms-details">
                                    <div class="forms-details">
                                        <el-row :gutter="20">
                                            <el-col :span="12">
                                                <el-form-item label="Fullname" prop="fullname">
                                                    <el-input v-model="forms.fullname"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Email" prop="email">
                                                    <el-input v-model="forms.email"></el-input>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="12">
												<el-form-item label="Supplier">
													<el-select v-model="forms.supplier">
														<el-option
															v-for="(dataSup, indexSup) in itemsSupplier"
															:key="indexSup"
															:value="dataSup.id"
															:label="dataSup.name"></el-option>
													</el-select>
												</el-form-item>
											</el-col>
											<el-col :span="12">
												<el-form-item label="Warehouse">
													<el-select v-model="forms.warehouse">
														<el-option
															v-for="(dataWare, indexWare) in itemsWarehouse"
															:key="indexWare"
															:value="dataWare.id"
															:label="dataWare.name"></el-option>
													</el-select>
												</el-form-item>
											</el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Password" prop="password" v-if="formsType !== 'edit'">
                                                    <el-input v-model="forms.password" type="password"></el-input>
                                                </el-form-item>
                                                <el-form-item label="Password" v-else>
                                                    <el-input v-model="forms.password" type="password"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Repeat Password" prop="rpassword" v-if="formsType !== 'edit'">
                                                    <el-input v-model="forms.rpassword" type="password"></el-input>
                                                </el-form-item>
                                                <el-form-item label="Repeat Password" v-else>
                                                    <el-input v-model="forms.rpassword" type="password"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Roles" prop="roles" class="roles-value-set">
                                                    <el-checkbox-group v-model="forms.roles">
                                                        <el-checkbox
                                                            v-for="(dataRole, indexRole) in itemsRole"
                                                            :key="indexRole"
                                                            :label="dataRole.id">{{dataRole.name}}</el-checkbox>
                                                    </el-checkbox-group>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Image">
                                                    <form ref="fileform" class="fileForm">
                                                        <div class="custom-upload-images">
                                                            <div class="img-first-step" v-show="(progressFirst == false)">
                                                                <span class="img-upload-tittle"><img :src="require('@/assets/images/icons/image.png')"></span>
                                                                <div class="text">Drag and drop your image here or <a href="#" @click.prevent="uploadTrigger">Browse</a></div>
                                                                <input type="file" accept="image/x-png,image/gif,image/jpeg" @change="handleUpload" class="custom-upload-tag">
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
                        <el-button class="button-outline-black" id="cancel" @click="closeModal()">Batal</el-button>
                        <el-button v-show="(formsType == 'edit')" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button>
                        <el-button v-show="(formsType != 'edit')" class="button-white-green" id="save" @click.prevent="submitSave('formsvalid', 'save')">Simpan</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import pageHeader from '@/components/pageHeader'
import loadingSvg from '@/components/loadingSvg'

export default {
    name: 'user',
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
            sectionApi: 'users',
			sectionApiRoles: 'roles',
			sectionApiSupplier: 'supplier',
			sectionApiWarehouse: 'warehouse',
            loading: false,
            loadingForm: false,
			loadingRole: false,
			searchQuery: "",
            itemsData: [],
			itemsRole: [],
			itemsSupplier: [],
			itemsWarehouse: [],
            itemDataDetail: [],
            totalPage: '',
            limit: 10,
            page: 1,
            titleForms: '',
            formsType: '',
            messagesuccess: '',
            messageerror: '',
            dataTextCreate: 'Buat User',
            dataTextUpdate: 'Edit User',
            confirmDescDelete: 'Anda yakin akan menghapus data User dari daftar?',
            confirmTitleDelete: 'Hapus Hubs',
            textDataCreateSuccess: 'Data User Berhasil ditambahkan.',
            textDataUpdateSuccess: 'Data User Berhasil diupdate.',
            textDataDeleteSuccess: '1 Items Berhasil dihapus.',
            forms:{
                fullname: '',
                email: '',
                password: '',
                rpassword: '',
                roles: [],
                files: '',
				filesEdit: '',
				supplier: '',
				warehouse: '',
            },
            rules:{
                fullname: [ { required: true, message: 'Inputan harus diisi', trigger: 'blur' } ],
                email: [
                    { required: true, message: 'Inputan harus diisi', trigger: 'blur' },
                    { type: 'email', message: 'Kolom email harus berupa email', trigger: ['blur', 'change'] }
                ],
                roles: [ { required: true, message: 'Inputan harus diisi', trigger: 'change' } ],
                password: [ { validator: validatePass, trigger: 'blur' } ],
                rpassword: [ { validator: validatePass2, trigger: 'blur' } ],
                files: [ { required: true, message: 'Inputan harus diisi', trigger: 'change' } ]
            },

            // images
            progressShow: false,
            doneProgress: false,
            progressFirst: false,
            dragAndDropCapable: false,
            uploadPercentage: 0,
        }
    },
    created(){
        this.$FUNCTIONS.checkPermissions(this.$dataRole['.cms.user.get'])
	},
	watch: {
        searchQuery: function(){
            this.getResult()
            this.$FUNCTIONS.checkPaginations()
        }
    },
    mounted(){
        this.getPost()
		this.getRoleData()
		this.getPostSupplier()
		this.getPostWarehouse()
        this.initCreateFunction()
    },
    methods:{
        buildUrl(value){
            if(value == true){
                return this.$baseUrlAuthCMS + this.sectionApi + "?limit=" + this.limit + "&page=" + this.page + "&search=" + this.searchQuery
            }else{
                return this.$baseUrlAuthCMS + this.sectionApi
            }
        },
        buildRoleUrl(){
            return this.$baseUrlAuthCMS + this.sectionApiRoles + "?limit=100&page=1"
        },
        async getPost(){
            try{
                this.loading = true
                const response = await this.$services.getList(this.buildUrl(true))
                this.loading = false
                if(response.status == 200){
                    this.itemsData = response.data.data
                    this.totalPage = response.data.pagination.rowCount
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
		},
		getResult: _.debounce(function(){
            this.getPost()
        }, 500),
        async getRoleData(){
            try{
                this.loadingRole = true
                const response = await this.$services.getList(this.buildRoleUrl())
                this.loadingRole = false
                if(response.status == 200){
                    this.itemsRole = response.data.data
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
		},
		async getPostSupplier(){
			let url = this.$baseUrl + this.sectionApiSupplier + "?limit=100&page=1"
            try{
                const response = await this.$services.getList(url)
                if(response.status == 200){
                    this.itemsSupplier = response.data.data
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
		},
		async getPostWarehouse(){
			let url = this.$baseUrl + this.sectionApiWarehouse +"?limit=100&page=1"
            try{
                const response = await this.$services.getList(url)
                if(response.status == 200){
                    this.itemsWarehouse = response.data.data
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
                        this.getPost()
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

                        this.forms.fullname = this.itemDataDetail.fullname
						this.forms.email = this.itemDataDetail.email
						this.forms.supplier = this.itemDataDetail.supplier_id
						this.forms.warehouse = this.itemDataDetail.warehouse_id

                        if(this.itemDataDetail.picture !== null){
                            let url = this.itemDataDetail.picture
                            let filename = url.substring(url.lastIndexOf('/')+1);
                            this.$refs['preview'].src = this.itemDataDetail.picture_url
                            this.forms.files = { name: filename }
                            this.progressFirst = true
                            this.doneProgress = true
                        }

                        if((this.itemDataDetail.roles).length !== 0){
                            (this.itemDataDetail.roles).forEach(function(e){
                                this.forms.roles.push(e.id)
                            }, this)
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
        submitSave(formName, formtype){
            let loadingform = this.$FUNCTIONS.svgSpinner
            this.messagesuccess = ''
			this.messageerror = ''

			console.log(this.forms.supplier)
			console.log(this.forms.warehouse)

            const formData = new FormData()
            formData.append('fullname', this.forms.fullname)
			formData.append('email', this.forms.email)
			this.forms.supplier !== '' ? formData.append('supplier_id', this.forms.supplier) : ""
			this.forms.warehouse !== '' ? formData.append('warehouse_id', this.forms.warehouse) : ""
            if(this.formsType !== 'edit'){
                formData.append('password', this.forms.password)
                formData.append('rpassword', this.forms.rpassword)
            }else{
                if(this.forms.password !== ''){
                    formData.append('password', this.forms.password)
                }
                if(this.forms.rpassword !== ''){
                    formData.append('rpassword', this.forms.rpassword)
                }
			}

			let dataRoles = this.forms.roles
			dataRoles.forEach(function(e, i){
				formData.append('roles['+i+']', e)
            }, this)

            this.$refs[formName].validate((valid) => {
                if(valid) {
                    if(formtype == 'save'){
                        document.getElementById('save').children[0].innerHTML = loadingform
                        if(this.forms.files !== ''){
                            formData.append('picture', this.forms.files)
                        }
                        this.postFunction('post', formData, this.buildUrl(false))
                    }else{
                        document.getElementById('save-edit').children[0].innerHTML = loadingform

                        if(this.forms.files['type'] != undefined){
                            formData.append('picture', this.forms.files)
                        }

                        let url = this.buildUrl(false) + '/' + this.itemDataDetail.id
                        this.postFunction('put', formData, url)
                    }
                }
            })
        },
        deletePost(id) {
            this.$confirm(this.confirmDescDelete, this.confirmTitleDelete, {
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                type: "warning"
            }).then(() => {
                let url = this.buildUrl(false) + "/" + id
                this.postFunction("delete", "", url)
            });
        },
        handleCurrentChange(val){
            if(val){
                // if(this.$dataRole['.cms.user.*.get']){
                    this.titleForms = this.dataTextUpdate
                    this.formsType = 'edit'
                    let url = this.buildUrl(false) + "/" + val.id
                    this.postFunction("detail", "", url)
                    this.$FUNCTIONS.sidebarToggle(true)
                // }else{
                //     this.$FUNCTIONS.notify('Error', 'error', 'Akses ditolak')
                // }
            }
        },
        limitChange(limit){
            this.limit = limit
            this.$FUNCTIONS.checkPaginations()
            this.getPost()
            this.$FUNCTIONS.viewActive()
        },
        pageChange(page){
            this.page = page
            this.getPost()
        },
        initCreateFunction(){
            let that = this
            setTimeout(function(){
                document.querySelector('.add-click-forms').addEventListener('click', function(){
                    if(that.loading == false){
                        that.titleForms = that.dataTextCreate
                        that.formsType = 'create'
                        that.$FUNCTIONS.sidebarToggle(true)
                    }else{
                        that.$notify({
                            type: 'warning',
                            title: 'Maaf',
                            message: that.textMemuatData
                        });
                    }
                })
            }, 500)
        },
        closeModal(row){
            this.$FUNCTIONS.sidebarToggle(false)
            this.$refs.singleTable.setCurrentRow(row)
            // this.$refs.formsvalid.resetFields()
            this.forms.fullname = ''
            this.forms.email = ''
            this.forms.password = ''
            this.forms.rpassword = ''
            this.forms.roles = []
            this.forms.files = ''
			this.forms.filesEdit = ''
			this.forms.supplier = ''
			this.forms.warehouse = ''
            this.progressShow = false
            this.doneProgress = false
            this.progressFirst = false
        },

        // images
        uploadTrigger(){
            if(document.querySelector('.custom-upload-tag').length != 0){
                document.querySelector('.custom-upload-tag').click('click')
            }
        },
        handleUpload(event){
            if ( /\.(jpe?g|png|gif)$/i.test( event.target.files[0].name ) ) {
                // if(event.target.files[0].size < 512000){
                    this.forms.files = event.target.files[0]
                    this.progressFirst = true
                    this.move()
                // }else{
                    // this.$message.error('Maaf, Ukuran Images tidak boleh lebih dari 512KB');
                // }
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
    }
}
</script>
