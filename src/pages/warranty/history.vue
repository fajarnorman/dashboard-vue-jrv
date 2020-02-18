<template>
    <div class="content-wrapper">
        <div id="product-brand">
			<div class="page-header">
                <div class="page-header-content clearfix">
					<router-link v-bind:to="'/warranty'" class="back-button">
						<i class="icon icon-caret-left"></i> Back to List
					</router-link>
                </div>
			</div>
            <page-header titleName="History Garansi" :isCreate="true"></page-header>
            <div class="content">
                <div class="filterSearching clearfix">
                    <div class="input-with-icons clearfix">
                        <el-input v-model="searchQuery" class="float-left"></el-input>
                        <img :src="require('@/assets/images/icons/search1.png')">
                    </div>
					<el-button class="button-outline-green float-right" @click.prevent="getExcel" round>
						<img :src="require('@/assets/images/icons/download-new.png')" v-if="(loadingExcel == false)">
						<div class="lds-ring" v-else><div></div><div></div><div></div><div></div></div> Export
					</el-button>
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
                    <el-table-column label="Problem" prop="problem"></el-table-column>
                    <el-table-column label="Solution" prop="solution"></el-table-column>
                    <el-table-column label="Status" prop="status"></el-table-column>
                    <el-table-column label="Handling Type" prop="handling_type"></el-table-column>
                    <el-table-column label="Handling By" prop="handling_by"></el-table-column>
                    <el-table-column label="Handling Date" width="140">
                        <template slot-scope="scope">
                            {{scope.row.handling_date | moment("YYYY-MM-DD")}}
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
                                                <el-form-item label="Problem" prop="problem">
                                                    <el-input v-model="forms.problem" type="textarea" :rows="5"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Solution">
                                                    <el-input v-model="forms.solution" type="textarea" :rows="5"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Status">
                                                    <el-radio-group v-model="forms.status">
                                                        <el-radio label="pending">Pending</el-radio>
                                                        <el-radio label="progress">Progress</el-radio>
                                                        <el-radio label="complete">Complete</el-radio>
                                                    </el-radio-group>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Handling Type">
                                                    <el-input v-model="forms.handling_type"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Handling Date" prop="handling_date">
                                                    <el-date-picker type="date" :format="format" :value-format="format" v-model="forms.handling_date"></el-date-picker>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Handling by">
                                                    <el-input v-model="forms.handling_by"></el-input>
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
import XLSX from 'xlsx'
import pageHeader from '@/components/pageHeader'
import loadingSvg from '@/components/loadingSvg'

export default {
    name: 'history-warranty',
    components: { pageHeader, loadingSvg },
    data(){
        return{
            sectionApi: "warrantyHistory",
            getId: this.$route.params.id,
            limit: 10,
            page: 1,
            loading: false,
            loadingForm: false,
			loadingExcel: false,
            itemsData: [],
            itemDataDetail: [],
            format: "yyyy-MM-dd",
            totalPage: 0,
            searchQuery: "",
            titleForms: "",
            formsType: "",
            messagesuccess: "",
            messageerror: "",
            forms: {
                problem: "",
                solution: "",
                status: "pending",
                handling_type: "",
                handling_date: "",
                handling_by: "",
            },
            rules: {
				problem: [ { required: true, message: "Inputan Harus diisi", trigger: "blur" } ],
				handling_date: [ { required: true, message: "Inputan Harus diisi", trigger: "blur" } ],
            },
            dataTextCreate: "Buat History Garansi",
            dataTextUpdate: "Edit History Garansi",
            confirmDescDelete: "Anda yakin akan menghapus data History Garansi dari daftar?",
            confirmTitleDelete: "Hapus History Garansi",
            textDataCreateSuccess: "Data History Garansi Berhasil ditambahkan.",
            textDataUpdateSuccess: "Data History Garansi Berhasil diupdate.",
            textDataDeleteSuccess: "1 Items Berhasil dihapus.",
        }
    },
    created(){
        this.$FUNCTIONS.checkPermissions(this.$dataRole['.cms.warrantyhistory.*.get'])
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
                return this.$baseUrl + this.sectionApi + '/' + this.getId +  "?limit=" + this.limit + "&page=" + this.page + "&search=" + this.searchQuery
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
                this.titleForms = this.dataTextUpdate
                this.formsType = "edit"
                this.itemDataDetail = val
                this.forms.problem = this.itemDataDetail.problem
                this.forms.solution = this.itemDataDetail.solution
                this.forms.status = this.itemDataDetail.status
                this.forms.handling_type = this.itemDataDetail.handling_type
                this.forms.handling_date = this.$FUNCTIONS.formatDate(this.itemDataDetail.handling_date)
                this.forms.handling_by = this.itemDataDetail.handling_by
                this.$FUNCTIONS.sidebarToggle(true)
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
                        let url = this.buildUrl(false) + '/' + this.getId
                        this.postFunction("post", this.forms, url)
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
            this.forms.problem = ""
            this.forms.solution = ""
            this.forms.status = "pending"
            this.forms.handling_type = ""
            this.forms.handling_date = ""
            this.forms.handling_by = ""
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
		async getExcel(){
			if(this.itemsData.length != 0){
				let databeforeExcel = []
                let exportToExcel = []
				try{
					this.loadingExcel = true
					this.limit = this.totalPage
					this.page = 1
					let url = this.buildUrl(true)
					const response = await this.$services.getList(url)
					this.loadingExcel = false
					if(response.status == 200){
						databeforeExcel = response.data.data
						databeforeExcel.forEach(function(currentValue, i, arr){
							let dateHandlingDate = new Date(currentValue.handling_date)
							let fulldateHandlingDate = dateHandlingDate.getFullYear() + '-' + (dateHandlingDate.getMonth() + 1) + '-' + dateHandlingDate.getDate()

							exportToExcel.push(
								{
									'Problem' : currentValue.problem,
									'Solution': currentValue.solution,
									'Status' : currentValue.status,
									'Handling Type' : currentValue.handling_type,
									'Handling By': currentValue.handling_by,
									'Handling Date': fulldateHandlingDate,
								}
							)
                        }, this)

                        let filename = "history-garansi-jarvis"
                        var wscols = [
							{wch:35},
							{wch:35},
							{wch:20},
							{wch:20},
							{wch:20},
							{wch:20}
						];

                        var datas = XLSX.utils.json_to_sheet(exportToExcel)
                        datas['!cols'] = wscols;
                        var wb = XLSX.utils.book_new()
                        XLSX.utils.book_append_sheet(wb, datas, 'History Garansi')
                        XLSX.writeFile(wb, filename+'.xlsx')
					}else{
						this.$FUNCTIONS.checkErrorResponse(response.status)
					}
				}catch(err){
					this.loadingExcel = false
					this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
				}
			}else{
				this.$FUNCTIONS.notify('error', 'Maaf', 'Data Kosong')
			}
		}
    }
}
</script>
