<template>
    <div class="content-wrapper">
        <div id="master-barang-attribute">
            <div class="page-header">
                <page-header titleName="Lokasi Toko" :isCreate="true"></page-header>
            </div>
            <div class="content">
                <div class="filterSearching clearfix">
                    <div class="input-with-icons clearfix" style="margin-right: 0;">
                        <el-input v-model="searchQuery" class="float-left"></el-input>
                        <img :src="require('@/assets/images/icons/search1.png')">
                    </div>
                    <el-select v-model="filterQuery" :loading="loadingProvince" placeholder="Pilih Provinsi">
                        <el-option value="" label="Pilih Provinsi">Semua Provinsi</el-option>
                        <el-option
                            v-for="itemType in itemsProvince"
                            :key="itemType.id"
                            :label="itemType.name"
                            :value="itemType.id"></el-option>
                    </el-select>
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
                    <el-table-column prop="name" label="Nama"></el-table-column>
                    <el-table-column prop="pic" label="PIC"></el-table-column>
                    <el-table-column prop="phone" label="Telp"></el-table-column>
                    <el-table-column prop="address" label="Alamat"></el-table-column>
                    <el-table-column label="Last Update">
                        <template slot-scope="scope">
                            <div v-if="scope.row.updated_at == null">
                                {{scope.row.created_at | moment("YYYY-MM-DD, H:mm:ss")}}
                            </div>
                            <div v-else>
                                {{scope.row.updated_at | moment("YYYY-MM-DD, H:mm:ss")}}
                            </div>
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
                                    <h5>Info Lokasi Toko</h5>
                                    <div class="forms-details">
                                        <el-row :gutter="20">
                                            <el-col :span="24">
                                                <el-form-item label="Nama" prop="name">
                                                    <el-input v-model="forms.name"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Telp/Hp">
                                                    <el-input v-model="forms.phone"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="PIC" prop="pic">
                                                    <el-input v-model="forms.pic"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Provinsi" prop="province">
                                                    <el-select
														@change="changeProvince"
														v-model="forms.province"
														filterable
														:loading="loadingProvince"
														placeholder="Pilih Provinsi">
                                                        <el-option
                                                            v-for="itemType in itemsProvince"
                                                            :key="itemType.id"
                                                            :label="itemType.name"
                                                            :value="itemType.id"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="12">
                                                <el-form-item label="Kota">
                                                    <el-select
														v-model="forms.city"
														filterable
														:loading="loadingCity"
														remote
														reserve-keyword
														:remote-method="searchCity"
														placeholder="Pilih Kota">
                                                        <el-option
                                                            v-for="itemType in itemsCity"
                                                            :key="itemType.id"
                                                            :label="itemType.name"
                                                            :value="itemType.id"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Lokasi" prop="address">
                                                    <create-locations-store
                                                        ref="locationsHubForms"
                                                        :dataForms="forms"
                                                        :dataFormsAddress="dataAddress"
                                                        :dataFormsLatitute="dataLatitute"
                                                        :dataFormsLongitute="dataLongitute"
                                                        :typeForms="formsType"></create-locations-store>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Image">
                                                    <form ref="fileform" class="fileForm">
                                                        <div class="custom-upload-images">
                                                            <div class="img-first-step" v-show="(progressFirst == false)">
                                                                <span class="img-upload-tittle"><img :src="require('@/assets/images/icons/image.png')"></span>
                                                                <div class="text">Drag and drop your image here or <a href="#" @click.prevent="uploadTrigger">Browse</a></div>
                                                                <input type="file" id="img-custom-empty" accept="image/x-png,image/gif,image/jpeg" @change="handleUpload" class="custom-upload-tag">
                                                            </div>
                                                            <div class="progressbar-content" v-show="(progressShow == true)">
                                                                <h4>Uploading your image</h4>
                                                                <div class="progressbar">
                                                                    <div class="myBar" id="myBar"></div>
                                                                </div>
                                                                <div class="file-info">
                                                                    <span class="percentage"></span> of {{formatBytes(files.size)}} uploaded
                                                                </div>
                                                            </div>
                                                            <div class="result-upload-img" v-show="(doneProgress == true)">
                                                                <div class="file-listing">
                                                                    <img class="preview" id="previews" v-bind:ref="'preview'"/>
                                                                    <span v-if="files">{{ files.name }}</span>
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
import CreateLocationsStore from './CreateLocationsStore'
import { faEdit, faTrashAlt, faInfoCircle, faHistory } from '@fortawesome/free-solid-svg-icons'

export default {
    name: 'store',
    components: { pageHeader, loadingSvg, CreateLocationsStore },
    data(){
        return{
            sectionApi: 'store',
			sectionApiProvince: 'location/province',
			sectionApiCity: 'location/city',
            loading: false,
            loadingForm: false,
			loadingProvince: false,
			loadingCity: true,
            itemsData: [],
			itemsProvince: [],
			itemsCity: [],
            itemDataDetail: [],
            totalPage: '',
            limit: 10,
            page: 1,
            filterQuery: "",
            searchQuery: "",
            titleForms: '',
            formsType: '',
            messagesuccess: '',
            messageerror: '',
            dataTextCreate: 'Buat Toko',
            dataTextUpdate: 'Edit Toko',
            confirmDescDelete: 'Anda yakin akan menghapus data Toko dari daftar?',
            confirmTitleDelete: 'Hapus Toko',
            textDataCreateSuccess: 'Data Toko Berhasil ditambahkan.',
            textDataUpdateSuccess: 'Data Toko Berhasil diupdate.',
            textDataDeleteSuccess: '1 Items Berhasil dihapus.',
            forms:{
                name: '',
                pic: '',
                phone: '',
                address: '',
                latitude: '',
                longitude: '',
				province: '',
				city: '',
            },
            rules:{
                name: [ { required: true, message: 'Inputan harus diisi', trigger: 'blur' } ],
                address: [ { required: true, message: 'Inputan harus diisi', trigger: 'blur' } ],
                province: [ { required: true, message: 'Inputan harus diisi', trigger: 'blur' } ],
            },
            dataAddress: '',
            dataLatitute: '',
            dataLongitute: '',
            fontsIcons:{
                edit: faEdit,
                delete: faTrashAlt,
                detail: faInfoCircle,
                history: faHistory
            },

            // images
            progressShow: false,
            doneProgress: false,
            progressFirst: false,
            dragAndDropCapable: false,
            files: '',
            filesEdit: '',
            uploadPercentage: 0,
        }
    },
    created(){
        this.$FUNCTIONS.checkPermissions(this.$dataRole['.cms.store.get'])
    },
    mounted(){
        this.getPost()
        this.initCreateFunction()
		this.getPostCategories('province', '')
		this.getPostCategories('city', '')
    },
    watch: {
        searchQuery: function(){
            this.getResult()
            this.$FUNCTIONS.checkPaginations()
        },
        filterQuery: function(){
            this.getPost()
            this.$FUNCTIONS.checkPaginations()
        }
    },
    methods:{
        buildUrl(value){
            if(value == true){
                return this.$baseUrl + this.sectionApi + "?limit=" + this.limit + "&page=" + this.page + "&search=" + this.searchQuery + "&province_id=" + this.filterQuery
            }else{
                return this.$baseUrl + this.sectionApi
            }
        },
        buildCategoriesUrl(value, search, province){
            if(value == 'province'){
                return this.$baseUrl + this.sectionApiProvince + "?limit=50&page=1&order=name&sort=ASC"
            }else if(value == 'city'){
				return this.$baseUrl + this.sectionApiCity + "?limit=50&page=1&order=name&sort=ASC&search=" + search + "&province_id=" + province
			}
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
        async getPostCategories(value, search, province){
            if(value == 'province'){
                try{
                    this.loadingProvince = true
                    const response = await this.$services.getList(this.buildCategoriesUrl(value))
                    this.loadingProvince = false
                    if(response.status == 200){
                        this.itemsProvince = response.data.data
                    }else{
                        this.$FUNCTIONS.checkErrorResponse(response.status)
                    }
                }catch(err){
                    this.loadingProvince = false
                    this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
                }
            }else if(value == 'city'){
				try{
                    this.loadingCity = true
					const response = await this.$services.getList(this.buildCategoriesUrl(value, search, province))
					this.loadingCity = false
                    if(response.status == 200){
                        this.itemsCity = response.data.data
                    }else{
                        this.$FUNCTIONS.checkErrorResponse(response.status)
                    }
                }catch(err){
                    this.loadingProvince = false
                    this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
                }
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
                        this.forms.name = this.itemDataDetail.name
                        this.forms.pic = this.itemDataDetail.pic
                        this.forms.phone = this.itemDataDetail.phone
                        this.dataAddress = this.itemDataDetail.address
                        this.dataLatitute = this.itemDataDetail.latitude
                        this.dataLongitute = this.itemDataDetail.longitude
						this.forms.province = this.itemDataDetail.province_id
						this.forms.city = this.itemDataDetail.city_id

						this.getPostCategories('city', '', this.itemDataDetail.province_id)

                        if(this.itemDataDetail.image_url !== null){
                            let url = this.itemDataDetail.image_url
                            let filename = url.substring(url.lastIndexOf('/')+1);
                            this.$refs['preview'].src = this.itemDataDetail.image_url
                            this.files = { name: filename }
                            this.progressFirst = true
                            this.doneProgress = true
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
        getResult: _.debounce(function(){
            this.getPost()
        }, 500),
        submitSave(formName, formtype){
            let loadingform = this.$FUNCTIONS.svgSpinner
            this.messagesuccess = ''
            this.messageerror = ''

            let dataLocations = this.$refs.locationsHubForms.hubsLocations
            this.forms.address = this.$refs.locationsHubForms.valueAddress
            this.forms.latitude = ''+ dataLocations.latitute + ''
            this.forms.longitude = ''+ dataLocations.longitute + ''

            const formData = new FormData()
            formData.append('name', this.forms.name)
            formData.append('pic', this.forms.pic)
            formData.append('latitude', this.forms.latitude)
            formData.append('longitude', this.forms.longitude)
            formData.append('address', this.forms.address)
            formData.append('phone', this.forms.phone)
			formData.append('province_id', this.forms.province)
			formData.append('city_id', this.forms.city)

            this.$refs[formName].validate((valid) => {
                if(valid) {
                    if(formtype == 'save'){
                        document.getElementById('save').children[0].innerHTML = loadingform
                        formData.append('image', this.files)
                        this.postFunction('post', formData, this.buildUrl(false))
                    }else{
                        document.getElementById('save-edit').children[0].innerHTML = loadingform

                        if(this.files['type'] != undefined){
                            formData.append('image', this.files)
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
                // if(this.$dataRole['.cms.store.*.get']){
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
            this.$refs.formsvalid.resetFields()
            this.forms.name = ''
            this.forms.pic = ''
            this.forms.phone = ''
			this.forms.province = ''
			this.forms.city = ''
            this.forms.address = ''
            this.forms.latitude = ''
            this.forms.longitude = ''
            this.dataAddress = ''
            this.dataLatitute = ''
            this.dataLongitute = ''
            let dataLocations = this.$refs.locationsHubForms.hubsLocations
            dataLocations.address = ''
            dataLocations.latitute = ''
            dataLocations.longitute = ''
            this.files = ''
            this.progressShow = false
            this.doneProgress = false
			this.progressFirst = false
			if(document.getElementById('pac-input') !== null){
				document.getElementById('pac-input').value = ''
			}
			if(document.getElementById('img-custom-empty') !== null){
				document.getElementById('img-custom-empty').value = ""
			}
		},
		searchCity(query){
			if (query !== '') {
				this.loadingCity = true
				setTimeout(() => {
					this.loadingCity = false
					this.getPostCategories('city', query)
				}, 1000)
			}else{
				setTimeout(() => this.getPostCategories('city', ''), 1000)
			}
		},
		changeProvince(value){
			this.forms.city = ""
			this.getPostCategories('city', '', value)
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
                    this.files = event.target.files[0]
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
            if ( /\.(jpe?g|png|gif)$/i.test( this.files.name ) ) {
                let reader = new FileReader();
                reader.addEventListener("load", function(){
                    this.$refs['preview'].src = reader.result;
                }.bind(this), false);
                reader.readAsDataURL( this.files);
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
                            this.files = e.dataTransfer.files[0];
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
