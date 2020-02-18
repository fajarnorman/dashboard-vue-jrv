<template>
    <div class="content-wrapper">
        <div id="qrcode-batch">
            <page-header titleName="QR Code Batch" :isCreate="true"></page-header>
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
                    v-loading="loading"
                    class="mobayar-table">
                    <el-table-column label="Nama" prop="name"></el-table-column>
					<el-table-column label="Amount" prop="amount"></el-table-column>
					<el-table-column label="Actions">
						<template slot-scope="scope">
							<a href="#" style="margin-right: 5px;" @click.prevent="handleCurrentChange(scope.row)">
								<el-tooltip class="item" effect="dark" content="Edit QrCode Batch" placement="top">
									<font-awesome-icon style="font-size: 18px;" class="fontIcons" :icon="fontsIcons.edit" />
								</el-tooltip>
							</a>
							<a href="#" style="margin-right: 8px;" @click.prevent="printPreview(baseUrl + 'qrcode/html/' + scope.row._id, scope.row.name)">
								<el-tooltip class="item" effect="dark" content="Download QrCode Batch" placement="top">
									<font-awesome-icon style="font-size: 18px;" class="fontIcons" :icon="fontsIcons.print" />
								</el-tooltip>
							</a>
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
                                            <el-col :span="24">
                                                <el-form-item label="Nama" prop="name">
                                                    <el-input v-model="forms.name"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Amount" prop="amount">
													<el-input-number v-model="forms.amount" :min="1"></el-input-number>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                            </el-form>
                        </section>
                    </div>
                    <div class="actions-button clearfix">
                        <!-- <el-button v-if="$dataRole['.cms.colour.*.delete']" v-show="(formsType == 'edit')" class="button-outline-black" id="trash" @click.prevent="deletePost(itemDataDetail.id)">
                            <img :src="require('@/assets/images/icons/trash.png')" alt="img-trash">
                        </el-button> -->
                        <el-button class="button-outline-black" @click="closeModal()">Batal</el-button>
                        <!-- <el-button v-if="$dataRole['.cms.colour.*.put']" v-show="(formsType == 'edit')" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button> -->
                        <el-button v-show="(formsType != 'edit')" class="button-white-green" id="save" @click.prevent="submitSave('formsvalid', 'save')">Simpan</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { faDownload, faEdit } from '@fortawesome/free-solid-svg-icons'
import download from 'downloadjs'
import pageHeader from '@/components/pageHeader'
import loadingSvg from '@/components/loadingSvg'

export default {
    name: 'qrcode-batch',
    components: { pageHeader, loadingSvg },
    data(){
        return{
			baseUrl: this.$baseUrl,
            sectionApi: "qrcodeBatch",
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
                amount: 0,
            },
            rules: {
				name: [ { required: true, message: "Inputan Harus diisi", trigger: "blur" } ],
				amount: [ { required: true, message: "Inputan Harus diisi", trigger: "blur" } ],
            },
            dataTextCreate: "Buat QRCode Batch",
            dataTextUpdate: "Detail QRCode Batch",
            confirmDescDelete: "Anda yakin akan menghapus data QRCode Batch dari daftar?",
            confirmTitleDelete: "Hapus QRCode Batch",
            textDataCreateSuccess: "Data QRCode Batch Berhasil ditambahkan.",
            textDataUpdateSuccess: "Data QRCode Batch Berhasil diupdate.",
			textDataDeleteSuccess: "1 Items Berhasil dihapus.",
			fontsIcons:{
				print: faDownload,
				edit: faEdit
			},
        }
    },
    created(){
        this.$FUNCTIONS.checkPermissions(this.$dataRole['.cms.qrcodebatch.get'])
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
                    this.itemsData = response.data.data
                    this.totalPage = response.data.pagination.rowCount
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
                        this.forms.code = this.itemDataDetail.code
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
                // if(this.$dataRole['.cms.qrcode.html.*.get']){
                    this.titleForms = this.dataTextUpdate
                    this.formsType = "edit"
                    this.itemDataDetail = val
                    let url = this.buildUrl(false) + "/" + val._id
                    this.postFunction("detail", "", url)

                    this.forms.name = this.itemDataDetail.name
                    this.forms.amount = this.itemDataDetail.amount

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
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if(formtype == "save") {
                        document.getElementById("save").children[0].innerHTML = loadingform
                        this.postFunction("post", this.forms, this.buildUrl(false))
                    }else{
                        document.getElementById("save-edit").children[0].innerHTML = loadingform
                        let urlv = this.buildUrl(false) + "/" + this.itemDataDetail.id
                        this.postFunction("put", this.forms, urlv)
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
			this.forms.amount = ""
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
		async printPreview(value, name){
			this.loading = true
			this.axios({
				url: value,
				methods: 'GET',
				responseType: 'blob',
			})
			.then(response => {
				this.loading = false
				if(response.status == 200){
					const content = response.headers['content-type']
           			download(response.data, name, content)
				}else{
					this.$FUNCTIONS.checkErrorResponse(response.status)
				}
			})
			.catch(error => {
				this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
			})
		}
    }
}
</script>
