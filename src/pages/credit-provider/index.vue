<template>
    <div class="content-wrapper">
        <div id="product-colour">
            <page-header titleName="Credit Provider" :isCreate="true"></page-header>
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
					<el-table-column label="Sort" width="50" align="center">
						<template slot-scope="scope">
							<a href="#" @click.prevent="" :dataId="scope.row.id" class="handle-sort"><font-awesome-icon class="fontIcons" :icon="fontsIcons.drags" /></a>
						</template>
					</el-table-column>
                    <el-table-column label="Nama" prop="name"></el-table-column>
					<el-table-column label="Slug" prop="slug"></el-table-column>
					<el-table-column label="Status" prop="status"></el-table-column>
                    <el-table-column label="Updated At">
                        <template slot-scope="scope">
                            {{scope.row.updated_at | moment("YYYY-MM-DD, H:mm:ss")}}
                        </template>
                    </el-table-column>
                    <el-table-column label="Created At">
                        <template slot-scope="scope">
                            {{scope.row.created_at | moment("YYYY-MM-DD, H:mm:ss")}}
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
                            <el-button id="cancel" @click="closeModal()"><img :src="require('@/assets/images/icons/big-close.png')"></el-button>
                        </header>
                        <section>
                            <el-form :model="forms" status-icon :rules="rules" ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                <div class="item-forms-details">
                                    <div class="forms-details">
                                        <el-row :gutter="20">
                                            <el-col :span="12">
                                                <el-form-item label="Nama" prop="name">
                                                    <el-input v-model="forms.name"></el-input>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="12">
                                                <el-form-item label="Slug" prop="slug">
                                                    <el-input v-model="forms.slug"></el-input>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="12">
                                                <el-form-item label="Interest Type" prop="interest_type">
													<el-select v-model="forms.interest_type">
														<el-option label="Percentage" value="percentage"></el-option>
														<el-option label="Fixed" value="fixed"></el-option>
													</el-select>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="12">
                                                <el-form-item label="Interest Rate" prop="interest_rate">
													<el-input type="number" v-model="forms.interest_rate"></el-input>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="12">
                                                <el-form-item label="DP Tipe">
													<el-select v-model="forms.dp_type">
														<el-option label="None" value="none"></el-option>
														<el-option label="Percentage" value="percentage"></el-option>
														<el-option label="Fixed" value="fixed"></el-option>
													</el-select>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="12">
                                                <el-form-item label="DP Rate">
													<el-input type="number" v-model="forms.dp_rate"></el-input>
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
											<el-col :span="24">
                                                <el-form-item label="Icon">
                                                    <form ref="fileform" class="fileForm">
                                                        <div class="custom-upload-images">
                                                            <div class="img-first-step" v-show="(progressFirst == false)">
                                                                <span class="img-upload-tittle"><img :src="require('@/assets/images/icons/image.png')"></span>
                                                                <div class="text"><a href="#" @click.prevent="uploadTrigger">Browse Images</a></div>
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
                        <el-button class="button-outline-black" @click="closeModal()">Batal</el-button>
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

import SortTable from 'sortablejs'
import {
	faArrowsAlt,
	faSortAmountDown
} from '@fortawesome/free-solid-svg-icons'

export default {
    name: 'credit-provider',
    components: { pageHeader, loadingSvg },
    data(){
        return{
            sectionApi: "creditProvider",
            limit: 10,
            page: 1,
            loading: false,
            loadingForm: false,
            itemsData: [],
            itemDataDetail: [],
            totalPage: 0,
            searchQuery: "",
            titleForms: "",
            formsType: "",
            messagesuccess: "",
            messageerror: "",
            forms: {
                name: "",
				slug: "",
				interest_type: "percentage",
				interest_rate: "",
				dp_type: "none",
				dp_rate: "",
				status: "active",
				files: '',
                filesEdit: '',
            },
            rules: {
                name: [ { required: true, message: "Inputan Harus diisi", trigger: "blur" } ],
            },
            dataTextCreate: "Buat Credit Provider",
            dataTextUpdate: "Edit Credit Provider",
            confirmDescDelete: "Anda yakin akan menghapus data Credit Provider dari daftar?",
            confirmTitleDelete: "Hapus Credit Provider",
            textDataCreateSuccess: "Data Credit Provider Berhasil ditambahkan.",
            textDataUpdateSuccess: "Data Credit Provider Berhasil diupdate.",
			textDataDeleteSuccess: "1 Items Berhasil dihapus.",
			// images
            progressShow: false,
            doneProgress: false,
            progressFirst: false,
            dragAndDropCapable: false,
			uploadPercentage: 0,
			fontsIcons: {
				drags: faArrowsAlt,
				sorts: faSortAmountDown,
			}
        }
    },
    created(){
        this.$FUNCTIONS.checkPermissions(this.$dataRole['.cms.creditprovider.get'])
    },
    mounted(){
        this.getPost()
        this.initCreateFunction()
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
                return this.$baseUrl + this.sectionApi + "?limit=" + this.limit + "&page=" + this.page + "&search=" + this.searchQuery
            }else{
                return this.$baseUrl + this.sectionApi
            }
        },
        async getPost(){
            try{
                this.loading = true
                const response = await this.$services.getList(this.buildUrl(true))
                this.loading = false
                if(response.status == 200){
					let that = this
                    this.itemsData = response.data.data
					this.totalPage = response.data.pagination.rowCount
					setTimeout(function(){
						that.sortsItems()
					}, 500)
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
						this.forms.name = this.itemDataDetail.name
						this.forms.slug = this.itemDataDetail.slug
						this.forms.interest_type = this.itemDataDetail.interest_type
						this.forms.interest_rate = this.itemDataDetail.interest_rate
						this.forms.dp_type = this.itemDataDetail.dp_type
						this.forms.dp_rate = this.itemDataDetail.dp_rate
						this.forms.status = this.itemDataDetail.status
						if(this.itemDataDetail.logo_url !== null){
                            let url = this.itemDataDetail.logo_url
                            let filename = url.substring(url.lastIndexOf('/')+1);
                            this.$refs['preview'].src = this.itemDataDetail.logo_url
                            this.forms.files = { name: filename }
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
        handleCurrentChange(val) {
            if (val) {
                // if(this.$dataRole['.cms.creditprovider.*.get']){
                    this.titleForms = this.dataTextUpdate
                    this.formsType = "edit"
                    let url = this.buildUrl(false) + "/" + val.id
                    this.postFunction("detail", "", url)
                    this.$FUNCTIONS.sidebarToggle(true)
                // }else{
                //     this.$FUNCTIONS.notify('Error', 'error', 'Akses ditolak')
                // }
            }
        },
        submitSave(formName, formtype) {
            let loadingform = this.$FUNCTIONS.svgSpinner
            this.messagesuccess = ""
			this.messageerror = ""
			const formData = new FormData()
			formData.append('name', this.forms.name)
			formData.append('slug', this.forms.slug)
			formData.append('interest_type', this.forms.interest_type)
			formData.append('interest_rate', this.forms.interest_rate)
			formData.append('dp_type', this.forms.dp_type)
			formData.append('dp_rate', this.forms.dp_rate)
			formData.append('status', this.forms.status)
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if(formtype == "save") {
						document.getElementById("save").children[0].innerHTML = loadingform
						if(this.forms.files !== ''){
                            formData.append('icon', this.forms.files)
                        }
                        this.postFunction("post", formData, this.buildUrl(false))
                    }else{
						document.getElementById("save-edit").children[0].innerHTML = loadingform
						if(this.forms.files['type'] != undefined){
                            formData.append('icon', this.forms.files)
                        }
                        let urlv = this.buildUrl(false) + "/" + this.itemDataDetail.id
                        this.postFunction("put", formData, urlv)
                    }
                }
            })
        },
        initCreateFunction() {
            let that = this
            setTimeout(function() {
                document.querySelector(".add-click-forms").addEventListener("click", function() {
                    if(that.loading == false){
                        that.titleForms = that.dataTextCreate
                        that.formsType = "create"
                        that.$FUNCTIONS.sidebarToggle(true)
                    }else{
                        that.$FUNCTIONS.notify('warning', 'Maaf', that.$textMemuatData)
                    }
                })
            }, 500)
        },
        closeModal(row) {
            this.$FUNCTIONS.sidebarToggle(false)
            this.$refs.singleTable.setCurrentRow(row)
			this.$refs.formsvalid.resetFields()
			this.forms.name = ""
			this.forms.slug = ""
			this.forms.interest_type = "percentage"
			this.forms.interest_rate = ""
			this.forms.dp_type = "none"
			this.forms.dp_rate = ""
			this.forms.status = "active"
			this.forms.icon = ""
			this.forms.files = ''
            this.forms.filesEdit = ''
            this.progressShow = false
            this.doneProgress = false
            this.progressFirst = false
        },
        formatPrice(val){
            return this.$FUNCTIONS.formatPrice(val)
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

		sortsItems(){
			let that = this
			var el = document.querySelector('.el-table__body-wrapper tbody');
			this.dataSortTable = SortTable.create(el,{
				animation: 150,
				handle: '.handle-sort',
				// Element dragging ended
				onEnd: function (/**Event*/evt) {
					var itemEl = evt.item;  // dragged HTMLElement
					evt.to;    // target list
					evt.from;  // previous list
					evt.oldIndex;  // element's old index within old parent
					evt.newIndex;  // element's new index within new parent

					var newIndexs = evt.newIndex
					var dataID = itemEl.children[0].children[0].children[0].getAttribute("dataId")
					that.updatePosition(dataID, newIndexs)
				},
			});
		},

		updatePosition(id, newPosition){
			let urlv = this.buildUrl(false) + '/sorting'
			this.loading = true
			this.axios.put(urlv, {
				id: id,
				sorting: newPosition
			})
			.then(response => {
				document.getElementById('save-edit').children[0].innerHTML = 'Simpan'
				if(response.data.status == 'error'){
					this.messageerror = response.data.message
				}else{
					// this.getPost()
					this.messagesuccess = "Credit Provider Berhasil diubah."
				}
			})
			.catch(error => { console.log(error);})
			.finally(() => {
				this.loading = false
			})
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
