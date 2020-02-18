<template>
    <div class="content-wrapper">
        <div id="switch-product">
            <page-header titleName="Penggabungan Produk" :isCreate="false"></page-header>
            <div class="content">
                <div class="filterSearching clearfix">
                    <div class="input-with-icons clearfix">
                        <el-input v-model="searchQuery" class="float-left"></el-input>
                        <img :src="require('@/assets/images/icons/search1.png')">
                    </div>
					<div class="float-right">
						<el-button class="button-white-green" @click.prevent="createForm('make-sparepart')" round>
							<i class="icon-plus3"></i> Make Sparepart
						</el-button>
						<el-button class="button-white-green" @click.prevent="createForm('make-bike')" round>
							<i class="icon-plus3"></i> Make Bike
						</el-button>
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
					<!-- <el-table-column label="Details" width="70" type="expand">
						<template slot-scope="scope">
							<div class="mobayar-table mobayar-table-v2">
								<table style="width: 100%;" v-if="(scope.row.details).length !== 0">
									<thead>
										<tr>
											<th width="350">Item</th>
											<th width="100" align="center">Qty</th>
											<th>Price</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="(dataDetail, indexDetail) in scope.row.details"
											:key="indexDetail">
											<td>
												<div v-if="dataDetail.item">
													<div><b>Name</b> : {{dataDetail.item.name}}</div>
													<div><b>Machine Number</b> : {{dataDetail.item.machine_number}}</div>
													<div><b>Chassis Number</b> : {{dataDetail.item.chassis_number}}</div>
												</div>
											</td>
											<td>{{dataDetail.qty}}</td>
											<td>Rp. {{formatPrice(dataDetail.price)}}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</template>
					</el-table-column> -->
                    <el-table-column label="Number" prop="number"></el-table-column>
					<el-table-column label="Tipe" prop="type"></el-table-column>
					<el-table-column label="Warehouse">
						<template slot-scope="scope">
							<div v-if="scope.row.warehouse">
								{{scope.row.warehouse.name}}
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
                            <el-button id="cancel" @click="closeModal()"><img :src="require('@/assets/images/icons/big-close.png')"></el-button>
                        </header>
                        <section>
                            <el-form :model="forms" status-icon :rules="rules" ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                <div class="item-forms-details">
                                    <div class="forms-details">
                                        <el-row :gutter="20">
                                            <el-col :span="24">
                                                <el-form-item label="Warehouse" prop="warehouse">
                                                    <el-select v-model="forms.warehouse">
														<el-option
															v-for="(dataWarehouse, indexWarehouse) in itemsWareHouse"
															:key="indexWarehouse"
															:value="dataWarehouse.id"
															:label="dataWarehouse.name"></el-option>
													</el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Produk" prop="produk">
                                                    <el-select v-model="forms.product">
														<el-option
															v-for="(dataProduct, indexProduct) in itemsProduct"
															:key="indexProduct"
															:value="dataProduct.id"
															:label="dataProduct.name"></el-option>
													</el-select>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="12">
                                                <el-form-item label="Nomor Rangka" prop="chassis_number">
													<el-input v-model="forms.chassis_number"></el-input>
                                                </el-form-item>
											</el-col>
											<el-col :span="24">
												<el-button
													round
													class="button-white-green"
													@click.prevent="checkFunctions(forms.warehouse, forms.product)">Check</el-button>
											</el-col>
											<el-col :span="24">
												<!-- <pre>{{itemDataDetail}}</pre> -->
												<div class="check-list" v-if="makeTo == 'sparepart'" style="position: relative;">
													<el-table
														:data="itemDataDetail"
														max-height="530"
														empty-text="No data available in table"
														ref="singleTableCheckSparepart"
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
													</el-table>
												</div>
												<div class="check-list" v-else style="position: relative;">
													<el-table
														:data="itemDataDetail"
														max-height="530"
														empty-text="No data available in table"
														ref="singleTableCheckBike"
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
														<el-table-column label="Qty Need" prop="qty_need"></el-table-column>
														<el-table-column label="Qty Total" prop="qty_total">
															<template slot-scope="scope">
																<span v-if="scope.row.qty_total !== null">{{scope.row.qty_total}}</span>
																<span v-else>-</span>
															</template>
														</el-table-column>
														<el-table-column label="Status" prop="status">
															<template slot-scope="scope">
																<span v-if="scope.row.status == 'success'" class="inline badge success">{{scope.row.status}}</span>
																<span v-else class="inline badge failed">{{scope.row.status}}</span>
															</template>
														</el-table-column>
													</el-table>
												</div>
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

export default {
    name: 'switch-product',
    components: { pageHeader, loadingSvg },
    data(){
        return{
			sectionApi: "combine",
			sectionApiWarehouse: "warehouse",
			sectionApiProduct: "product",
			sectionApiType: "type",
			sectionApiCombine: "combineBikeSparepart/bike/",
            limit: 10,
            page: 1,
            loading: false,
            loadingForm: false,
			itemsData: [],
			itemsWareHouse: [],
			itemsProduct: [],
			itemsType: [],
            itemDataDetail: [],
            totalPage: 0,
            searchQuery: "",
            titleForms: "",
			formsType: "",
			makeTo: "",
            messagesuccess: "",
            messageerror: "",
            forms: {
                warehouse: "",
				product: "",
				chassis_number: ""
            },
            rules: {
                chassis_number: [ { required: true, message: "Inputan Harus diisi", trigger: "blur" } ],
            },
            dataTextCreate: "Buat Warna Produk",
            dataTextUpdate: "Edit Warna Produk",
            confirmDescDelete: "Anda yakin akan menghapus data Warna Produk dari daftar?",
            confirmTitleDelete: "Hapus Warna Produk",
            textDataCreateSuccess: "Data Warna Produk Berhasil ditambahkan.",
            textDataUpdateSuccess: "Data Warna Produk Berhasil diupdate.",
            textDataDeleteSuccess: "1 Items Berhasil dihapus.",
        }
    },
    created(){
        this.$FUNCTIONS.checkPermissions(this.$dataRole['.cms.colour.get'])
    },
    mounted(){
		this.getPost()
		this.getPostWareHouse()
		this.getPostType()
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
		async getPostWareHouse(){
			let url = this.$baseUrl + this.sectionApiWarehouse + "?limit=100&page=1"
            try{
                const response = await this.$services.getList(url)
                if(response.status == 200){
                    this.itemsWareHouse = response.data.data
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
		},
		async getPostProduct(id){
			let url = this.$baseUrl + this.sectionApiProduct + "?limit=10&page=1&type_id=" + id
            try{
                const response = await this.$services.getList(url)
                if(response.status == 200){
                    this.itemsProduct = response.data.data
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
		},
		async getPostType(){
			let url = this.$baseUrl + this.sectionApiType + "?limit=100&page=1"
            try{
                const response = await this.$services.getList(url)
                if(response.status == 200){
					this.itemsType = response.data.data
					this.itemsType.forEach(function(e){
						if(e.slug == 'e-bike'){
							this.getPostProduct(e.id)
						}
					}, this)
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
                // if(this.$dataRole['.cms.colour.*.get']){
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

            this.$refs[formName].validate(valid => {
                if (valid) {
                    if(formtype == "save") {
						let dataValue, url
						let errorData = []

						if(this.makeTo == 'sparepart'){
							url = this.buildUrl(false)
							dataValue = {
								warehouse_id: this.forms.warehouse,
								product_id: this.forms.product,
								chassis_number: this.forms.chassis_number,
								type: "make-sparepart",
							}
							document.getElementById("save").children[0].innerHTML = loadingform
							this.postFunction("post", dataValue, url)
						}else{
							url = this.buildUrl(false) + '/make/bike'
							dataValue = {
								warehouse_id: this.forms.warehouse,
								product_id: this.forms.product,
								chassis_number: this.forms.chassis_number,
								type: "make-bike",
							}
							if(this.itemDataDetail.length !== 0){
								this.itemDataDetail.forEach(function(e){
									if(e.status !== 'success'){
										errorData.push('error')
									}
								}, this)
								if(errorData.length == 0){
									document.getElementById("save").children[0].innerHTML = loadingform
									this.postFunction("post", dataValue, url)
								}else{
									this.$FUNCTIONS.notify('error', 'Error', 'Maaf Sparepart tidak mencukupi')
								}
							}else{
								this.$FUNCTIONS.notify('error', 'Error', 'Maaf Mohon Cek Sparepart terlebih dahulu')
							}
						}
                    }else{
                        document.getElementById("save-edit").children[0].innerHTML = loadingform
                        let urlv = this.buildUrl(false) + "/" + this.itemDataDetail.id
                        this.postFunction("put", this.forms, urlv)
                    }
                }
            })
        },
		createForm(val){
			if(this.loading == false){
				if(val == 'make-sparepart'){
					this.titleForms = "Buat Sparepart"
					this.makeTo = "sparepart"
				}else{
					this.titleForms = "Buat Sepeda"
					this.makeTo = "bike"
				}
				this.formsType = "create"
				this.$FUNCTIONS.sidebarToggle(true)
			}else{
				this.$FUNCTIONS.notify('warning', 'Maaf', this.$textMemuatData)
			}
		},
        closeModal(row) {
            this.$FUNCTIONS.sidebarToggle(false)
            this.$refs.singleTable.setCurrentRow(row)
			this.$refs.formsvalid.resetFields()
			this.forms.warehouse = ""
			this.forms.product = ""
			this.forms.chassis_number = ""
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
		},
		async checkFunctions(warehouseId, bikeId){
			let url
			if(this.makeTo == 'sparepart'){
				url = this.$baseUrl + this.sectionApiCombine + bikeId
			}else{
				url = this.buildUrl(false) + '/check/sparepart/' + warehouseId + '/' + bikeId
			}
			try{
                this.loadingForm = true
                const response = await this.$services.getList(url)
                this.loadingForm = false
                if(response.status == 200){
					if(this.makeTo == 'sparepart'){
						this.itemDataDetail = response.data.data
					}else{
						this.itemDataDetail = response.data
					}
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
				this.loadingForm = false
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
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
