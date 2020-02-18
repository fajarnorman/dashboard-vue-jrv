<template>
    <div class="content-wrapper">
        <div id="language-page">
            <page-header titleName="Bahasa" :isCreate="true"></page-header>
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
                    <el-table-column label="Lang" prop="lang" width="70"></el-table-column>
					<el-table-column label="Key" prop="key"></el-table-column>
					<el-table-column label="Value" prop="value"></el-table-column>
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
								<!-- <el-button
									round
									class="button-white-green add-english-language"
									v-if="formsType !== 'edit'"
									@click.prevent="engglishLanguage = !engglishLanguage">
									<span v-if="!engglishLanguage">Tambah Bahasa</span>
									<span v-else>Hapus Bahasa</span>
								</el-button> -->
								<div class="item-forms-details" v-if="indoLanguage">
                                    <div class="forms-details">
                                        <el-row :gutter="20">
											<el-col :span="12" v-if="formsType == 'create'">
                                                <el-form-item label="Bahasa" prop="lang">
													<el-select multiple v-model="forms.lang">
														<el-option value="id" label="Bahasa Indonesia">Bahasa Indonesia</el-option>
														<el-option value="en" label="Bahasa Inggris">Bahasa Inggris</el-option>
													</el-select>
                                                </el-form-item>
											</el-col>
											<el-col :span="12" v-else>
												<el-form-item label="Bahasa">
													<el-select v-model="forms.langEdit">
														<el-option value="id" label="Bahasa Indonesia">Bahasa Indonesia</el-option>
														<el-option value="en" label="Bahasa Inggris">Bahasa Inggris</el-option>
													</el-select>
                                                </el-form-item>
											</el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Key" prop="key">
                                                    <el-input v-model="forms.key"></el-input>
                                                </el-form-item>
                                            </el-col>
											<div v-if="formsType == 'create'">
												<el-col :span="24"
													v-for="(langData, indexData) in forms.lang"
													:key="indexData">
													<el-form-item v-if="langData == 'id'" label="Value Indonesia" prop="valueId">
														<el-input v-model="forms.valueId" type="textarea" :rows="5"></el-input>
													</el-form-item>
													<el-form-item v-else label="Value Inggris" prop="valueEn">
														<el-input v-model="forms.valueEn" type="textarea" :rows="5"></el-input>
													</el-form-item>
												</el-col>
											</div>
											<div v-else>
												<el-col :span="24">
													<el-form-item label="Value">
														<el-input v-model="forms.valueEdit" type="textarea" :rows="5"></el-input>
													</el-form-item>
												</el-col>
											</div>
                                        </el-row>
                                    </div>
								</div>
                                <!-- <div class="item-forms-details" v-if="indoLanguage">
                                    <div class="forms-details">
                                        <el-row :gutter="20">
											<el-col :span="24">
                                                <el-form-item label="Bahasa" prop="langId">
													<el-select v-model="forms.langId">
														<el-option value="id" label="Bahasa Indonesia">Bahasa Indonesia</el-option>
														<el-option value="en" label="Bahasa Inggris">Bahasa Inggris</el-option>
													</el-select>
                                                </el-form-item>
											</el-col>
											<el-col :span="24">
                                                <el-form-item label="Value" prop="valueId">
                                                    <el-input v-model="forms.valueId" type="textarea" :rows="5"></el-input>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
								<div class="item-forms-details" v-if="engglishLanguage">
                                    <div class="forms-details">
                                        <el-row :gutter="20">
											<el-col :span="24">
                                                <el-form-item label="Bahasa" prop="langEn">
													<el-select v-model="forms.langEn">
														<el-option value="id" label="Bahasa Indonesia">Bahasa Indonesia</el-option>
														<el-option value="en" label="Bahasa Inggris">Bahasa Inggris</el-option>
													</el-select>
                                                </el-form-item>
											</el-col>
											<el-col :span="24">
                                                <el-form-item label="Value" prop="valueEn">
                                                    <el-input v-model="forms.valueEn" type="textarea" :rows="5"></el-input>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div> -->
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

export default {
    name: 'language-page',
    components: { pageHeader, loadingSvg },
    data(){
		var validateKeyEn = (rule, value, callback) => {
			if(this.engglishLanguage = true){
				if(value === ''){
					callback(new Error('Inputan Harus diisi'))
				}else{
					callback()
				}
			}
		}
		var validateValueEn = (rule, value, callback) => {
			if(this.engglishLanguage = true){
				if(value === ''){
					callback(new Error('Inputan Harus diisi'))
				}else{
					callback()
				}
			}
        }
        return{
            sectionApi: "language",
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
			engglishLanguage: false,
			indoLanguage: true,
            forms: {
				key: "",
				lang: ['id'],
				langEdit: "",
				valueId: "",
				valueEn: "",
				valueEdit: "",
            },
            rules: {
				key: [ { required: true, message: "Inputan Harus diisi", trigger: "blur" } ],
				value: [ { required: true, message: "Inputan Harus diisi", trigger: "blur" } ],
				lang: [ { required: true, message: "Inputan Harus diisi", trigger: "change" } ],
				valueId: [ { required: true, message: "Inputan Harus diisi", trigger: "blur" } ],
				valueEn: [ { required: true, message: "Inputan Harus diisi", trigger: "blur" } ],
            },
            dataTextCreate: "Buat Bahasa",
            dataTextUpdate: "Edit Bahasa",
            confirmDescDelete: "Anda yakin akan menghapus data Bahasa dari daftar?",
            confirmTitleDelete: "Hapus Bahasa",
            textDataCreateSuccess: "Data Bahasa Berhasil ditambahkan.",
            textDataUpdateSuccess: "Data Bahasa Berhasil diupdate.",
            textDataDeleteSuccess: "1 Items Berhasil dihapus.",
        }
    },
    created(){
        this.$FUNCTIONS.checkPermissions(this.$dataRole['.cms.language.get'])
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
                return this.$baseUrl + this.sectionApi + "?limit=" + this.limit + "&page=" + this.page + "&search=" + this.searchQuery + "&sort=DESC"
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
					document.getElementById("save").children[0].innerHTML = "Simpan"
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
					document.getElementById("save").children[0].innerHTML = "Simpan"
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
						this.forms.langEdit = this.itemDataDetail.lang
						this.forms.key = this.itemDataDetail.key
						this.forms.valueEdit = this.itemDataDetail.value
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
                // if(this.$dataRole['.cms.language.*.get']){
                    this.titleForms = this.dataTextUpdate
                    this.formsType = "edit"
					this.$FUNCTIONS.sidebarToggle(true)
					let url = this.buildUrl(false) + "/" + val.id
                    this.postFunction("detail", "", url)
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
						let dataValueId, dataValueEn
						let dataLang = this.forms.lang
						dataLang.forEach(function(e){
							if(e == 'id'){
								dataValueId = {
									lang: e,
									key: this.forms.key,
									value: this.forms.valueId
								}
								document.getElementById("save").children[0].innerHTML = loadingform
                        		this.postFunction("post", dataValueId, this.buildUrl(false))
							}else{
								dataValueEn = {
									lang: e,
									key: this.forms.key,
									value: this.forms.valueEn
								}
								document.getElementById("save").children[0].innerHTML = loadingform
                        		this.postFunction("post", dataValueEn, this.buildUrl(false))
							}
						}, this)
                    }else{
						let dataValue
						dataValue = {
							lang: this.forms.langEdit,
							key: this.forms.key,
							value: this.forms.valueEdit
						}
                        document.getElementById("save-edit").children[0].innerHTML = loadingform
                        let urlv = this.buildUrl(false) + "/" + this.itemDataDetail.id
                        this.postFunction("put", dataValue, urlv)
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
			this.engglishLanguage = false
			this.indoLanguage = true
			this.forms.lang = ['id']
			this.forms.langEdit = ""
			this.forms.key = ""
			this.forms.valueId = ""
			this.forms.valueEn = ""
			this.forms.valueEdit = ""
			this.itemDataDetail = []
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
        }
    }
}
</script>
<style lang="scss">
.add-english-language{
	position: absolute;
    right: 65px;
    z-index: 100000;
    top: 2px;
}
</style>
