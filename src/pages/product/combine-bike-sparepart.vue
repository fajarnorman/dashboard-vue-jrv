<template>
    <div class="content-wrapper">
        <div id="product-colour">
            <page-header titleName="Kombinasi Sparepart" :isCreate="true"></page-header>
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
                    <el-table-column label="Bike">
						<template slot-scope="scope">
							<div v-if="scope.row.bike">
								{{scope.row.bike.name}}
							</div>
						</template>
					</el-table-column>
					<el-table-column label="Sparepart">
						<template slot-scope="scope">
							<div v-if="scope.row.sparepart">
								{{scope.row.sparepart.name}}
							</div>
						</template>
					</el-table-column>
					<el-table-column label="Qty" prop="qty"></el-table-column>
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
											<el-col :span="12"
												v-for="(dataItems, indexItems) in itemsDataBikeSparePart"
												:key="indexItems">
                                                <el-form-item v-if="dataItems.label == 'e-bike'" label="Bike" prop="bike">
													<el-select filterable v-model="forms.bike">
														<el-option
															v-for="(dataBike, indexBike) in dataItems.data"
															:key="indexBike"
															:label="dataBike.name"
															:value="dataBike.id"></el-option>
													</el-select>
                                                </el-form-item>
												<el-form-item v-else-if="dataItems.label == 'spare-parts'" label="Sparepart" prop="sparepart">
													<el-select filterable v-model="forms.sparepart">
														<el-option
															v-for="(dataSparepart, indexSparepart) in dataItems.data"
															:key="indexSparepart"
															:label="dataSparepart.name"
															:value="dataSparepart.id"></el-option>
													</el-select>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="24">
                                                <el-form-item label="Qty" prop="qty">
                                                    <el-input-number type="number" :min="0" v-model="forms.qty"></el-input-number>
                                                </el-form-item>
                                            </el-col>
											<!-- Bike: {{forms.bike}}<br>
											Sparepart : {{forms.sparepart}}<br>
											Qty: {{forms.qty}}<br> -->
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
				<!-- <pre>{{itemsDataBikeSparePart}}</pre> -->
            </div>
        </div>
    </div>
</template>

<script>
import pageHeader from '@/components/pageHeader'
import loadingSvg from '@/components/loadingSvg'

export default {
    name: 'product-combine-sparepart',
    components: { pageHeader, loadingSvg },
    data(){
        return{
			sectionApi: "combineBikeSparepart",
			sectionApiTypeProduct: "type",
			sectionApiProduct: "product",
            limit: 10,
            page: 1,
            loading: false,
            loadingForm: false,
			itemsData: [],
			itemsDataType: [],
			itemsDataBikeSparePart: [],
			// itemsDataSparepart: [],
            itemDataDetail: [],
            totalPage: 0,
            searchQuery: "",
            titleForms: "",
            formsType: "",
            messagesuccess: "",
            messageerror: "",
            forms: {
                qty: "",
				bike: "",
				sparepart: "",
            },
            rules: {
                name: [ { required: true, message: "Inputan Harus diisi", trigger: "blur" } ],
            },
            dataTextCreate: "Buat Kombinasi Sparepart",
            dataTextUpdate: "Edit Kombinasi Sparepart",
            confirmDescDelete: "Anda yakin akan menghapus data Kombinasi Sparepart dari daftar?",
            confirmTitleDelete: "Hapus Kombinasi Sparepart",
            textDataCreateSuccess: "Data Kombinasi Sparepart Berhasil ditambahkan.",
            textDataUpdateSuccess: "Data Kombinasi Sparepart Berhasil diupdate.",
            textDataDeleteSuccess: "1 Items Berhasil dihapus.",
        }
    },
    created(){
        this.$FUNCTIONS.checkPermissions(this.$dataRole['.cms.combinebikesparepart.get'])
    },
    mounted(){
		this.getPost()
		this.getPostType()
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
		async getPostType(){
            try{
				let url = this.$baseUrl + this.sectionApiTypeProduct + "?limit=100&page=1"
                const response = await this.$services.getList(url)
                if(response.status == 200){
					this.itemsDataType = response.data.data
					this.itemsDataType.forEach(function(e){
						this.getPostProduct(e.id, e.slug)
					}, this)
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
		},
		async getPostProduct(value, slug){
			try{
				let url = this.$baseUrl + this.sectionApiProduct + "?limit=100&page=1&type_id=" + value
				const response = await this.$services.getList(url)
				if(response.status == 200){
					this.itemsDataBikeSparePart.push({
						label: slug,
						data: response.data.data
					})
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
					document.getElementById("save-edit").children[0].innerHTML = "Simpan"
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
						this.forms.qty = this.itemDataDetail.qty
						this.forms.bike = this.itemDataDetail.bike_id
						this.forms.sparepart = this.itemDataDetail.sparepart_id
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
                // if(this.$dataRole['.cms.combinebikesparepart.*.get']){
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
			let dataValue = {
				bike_id: this.forms.bike,
				sparepart_id: this.forms.sparepart,
				qty: this.forms.qty,
			}
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if(formtype == "save") {
                        document.getElementById("save").children[0].innerHTML = loadingform
                        this.postFunction("post", dataValue, this.buildUrl(false))
                    }else{
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
<style lang="scss" scoped>
.color-picker-custom{
    vertical-align: middle;
}
.color-code{
    display: inline-block;
    vertical-align: middle;
    margin-left: 5px;
}
</style>
