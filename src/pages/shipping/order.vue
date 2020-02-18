<template>
    <div class="content-wrapper">
        <div id="shippling-order-list">
            <page-header titleName="Order List" :isCreate="false"></page-header>
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
					<el-table-column label="Details" width="65" type="expand">
						<template slot-scope="scope">
							<div style="width: 70%;" class="mobayar-table mobayar-table-v2">
								<table style="width: 100%;" v-if="(scope.row.orderProducts).length !== 0">
									<thead>
										<tr>
											<th width="350">Product</th>
											<th>Price</th>
											<th>Weight</th>
											<th width="100" align="center">Qty</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="(dataDetail, indexDetail) in scope.row.orderProducts"
											:key="indexDetail">
											<td>
												<div v-if="dataDetail.product">
													{{dataDetail.product.name}}
												</div>
											</td>
											<td>Rp. {{formatPrice(dataDetail.price)}}</td>
											<td>{{dataDetail.weight}}</td>
											<td>{{dataDetail.qty}}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</template>
					</el-table-column>
					<el-table-column width="150" label="Code" prop="code"></el-table-column>
                    <el-table-column width="150" label="Shipping Method" prop="shipping_method"></el-table-column>
					<el-table-column label="Status" width="125">
						<template slot-scope="scope">
							<span v-if="scope.row.status !== null">{{scope.row.status}}</span>
							<span v-else>-</span>
						</template>
					</el-table-column>
					<el-table-column width="120" label="QTY Total" align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.qty_total !== null">{{scope.row.qty_total}}</span>
							<span v-else>-</span>
						</template>
					</el-table-column>
					<el-table-column width="150" label="Weight Total" align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.weight_total !== null">{{scope.row.weight_total}}</span>
							<span v-else>-</span>
						</template>
					</el-table-column>
					<el-table-column label="Payment" width="200">
						<template slot-scope="scope">
							<div>
								<span><b>Total : </b> Rp. {{formatPrice(scope.row.total)}}</span><br>
								<span><b>Subtotal : </b> Rp. {{formatPrice(scope.row.subtotal)}}</span><br>
								<span><b>Payment Fee : </b> Rp. {{formatPrice(scope.row.payment_fee)}}</span><br>
								<span><b>Ship Fee : </b> Rp. {{formatPrice(scope.row.ship_fee)}}</span><br>
								<span><b>Tax Fee : </b> Rp. {{formatPrice(scope.row.tax_fee)}}</span><br>
								<span><b>Discount : </b> Rp. {{formatPrice(scope.row.discount)}}</span><br>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="User" width="200">
						<template slot-scope="scope">
							<div v-if="scope.row.userAuth">
								<span><b>Fullname : </b> {{scope.row.userAuth.fullname}}<br></span>
								<span><b>Email : </b> {{scope.row.userAuth.email}}<br></span>
							</div>
						</template>
					</el-table-column>
                    <el-table-column width="100" label="Updated At">
                        <template slot-scope="scope">
                            {{scope.row.updated_at | moment("YYYY-MM-DD, H:mm:ss")}}
                        </template>
                    </el-table-column>
                    <el-table-column width="100" label="Created At">
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
                                                <el-form-item label="Code">
													<div class="remove-line-height">{{itemDataDetail.code}}</div>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="12">
                                                <el-form-item label="Shipping Method">
                                                    <div class="remove-line-height">{{itemDataDetail.shipping_method}}</div>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="(itemDataDetail.status == 'success' || itemDataDetail.status == 'failed') ? 12 : 24">
                                                <el-form-item label="Status">
													<div class="remove-line-height"
														 v-if="itemDataDetail.status == 'success' || itemDataDetail.status == 'failed'">{{itemDataDetail.status}}</div>
													<el-select v-else v-model="statusChange">
														<el-option label="Success" value="success"></el-option>
														<el-option label="Failed" value="failed"></el-option>
													</el-select>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="12">
                                                <el-form-item label="Reason">
													<div class="remove-line-height" v-if="itemDataDetail.reason !== null">{{itemDataDetail.reason}}</div>
													<div class="remove-line-height" v-else>-</div>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="12">
												<el-form-item label="Total">
													<div class="remove-line-height" v-if="itemDataDetail.total !== null">Rp. {{formatPrice(itemDataDetail.total)}}</div>
													<div class="remove-line-height" v-else>-</div>
                                                </el-form-item>
											</el-col>
											<el-col :span="12">
												<el-form-item label="Sub Total">
													<div class="remove-line-height" v-if="itemDataDetail.subtotal !== null">Rp. {{formatPrice(itemDataDetail.subtotal)}}</div>
													<div class="remove-line-height" v-else>-</div>
                                                </el-form-item>
											</el-col>
											<el-col :span="12">
												<el-form-item label="Payment Fee">
													<div class="remove-line-height" v-if="itemDataDetail.payment_fee !== null">Rp. {{formatPrice(itemDataDetail.payment_fee)}}</div>
													<div class="remove-line-height" v-else>-</div>
                                                </el-form-item>
											</el-col>
											<el-col :span="12">
												<el-form-item label="Ship Fee">
													<div class="remove-line-height" v-if="itemDataDetail.ship_fee !== null">Rp. {{formatPrice(itemDataDetail.ship_fee)}}</div>
													<div class="remove-line-height" v-else>-</div>
                                                </el-form-item>
											</el-col>
											<el-col :span="12">
												<el-form-item label="Tax Fee">
													<div class="remove-line-height" v-if="itemDataDetail.tax_fee !== null">Rp. {{formatPrice(itemDataDetail.tax_fee)}}</div>
													<div class="remove-line-height" v-else>-</div>
                                                </el-form-item>
											</el-col>
											<el-col :span="12">
												<el-form-item label="Discount">
													<div class="remove-line-height" v-if="itemDataDetail.discount !== null">Rp. {{formatPrice(itemDataDetail.discount)}}</div>
													<div class="remove-line-height" v-else>-</div>
                                                </el-form-item>
											</el-col>
											<el-col :span="12">
												<el-form-item label="Qty Total">
													<div class="remove-line-height" v-if="itemDataDetail.qty_total !== null">{{itemDataDetail.qty_total}}</div>
													<div class="remove-line-height" v-else>-</div>
                                                </el-form-item>
											</el-col>
											<el-col :span="12">
												<el-form-item label="Weight Total">
													<div class="remove-line-height" v-if="itemDataDetail.weight_total !== null">{{itemDataDetail.weight_total}}</div>
													<div class="remove-line-height" v-else>-</div>
                                                </el-form-item>
											</el-col>
											<el-col :span="12">
												<el-form-item label="Weight Total">
													<div class="remove-line-height" v-if="itemDataDetail.weight_total !== null">{{itemDataDetail.weight_total}}</div>
													<div class="remove-line-height" v-else>-</div>
                                                </el-form-item>
											</el-col>
											<el-col :span="12">
												<el-form-item label="Payment Method">
													<div class="remove-line-height" v-if="itemDataDetail.paymentMethod">
														{{itemDataDetail.paymentMethod.name}}
													</div>
													<div class="remove-line-height" v-else>-</div>
                                                </el-form-item>
											</el-col>
											<el-col :span="12">
												<el-form-item label="User Fullname">
													<div class="remove-line-height" v-if="itemDataDetail.userAuth">
														{{itemDataDetail.userAuth.fullname}}
													</div>
													<div class="remove-line-height" v-else>-</div>
                                                </el-form-item>
											</el-col>
											<el-col :span="12">
												<el-form-item label="User Email">
													<div class="remove-line-height" v-if="itemDataDetail.userAuth">
														{{itemDataDetail.userAuth.email}}
													</div>
													<div class="remove-line-height" v-else>-</div>
                                                </el-form-item>
											</el-col>
                                        </el-row>
                                    </div>
                                </div>
								<div class="item-forms-details" v-if="itemDataDetail.pickupPoint">
                                    <div class="forms-details">
										<h4 class="title">Pickup Point</h4>
										<el-row :gutter="20">
                                            <el-col :span="12">
                                                <el-form-item label="Name">
													<div class="remove-line-height">{{itemDataDetail.pickupPoint.name}}</div>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="12">
                                                <el-form-item label="Address">
													<div class="remove-line-height">{{itemDataDetail.pickupPoint.address}}</div>
                                                </el-form-item>
                                            </el-col>
										</el-row>
                                    </div>
								</div>
								<div class="item-forms-details" v-if="itemDataDetail.orderPayment">
                                    <div class="forms-details">
										<h4 class="title">Order Payment</h4>
										<el-row :gutter="20">
                                            <el-col :span="12">
                                                <el-form-item label="Sub Total">
													<div class="remove-line-height">
														Rp. {{formatPrice(itemDataDetail.orderPayment.subtotal)}}
													</div>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="12">
                                                <el-form-item label="Installment Fee">
													<div class="remove-line-height">
														Rp. {{formatPrice(itemDataDetail.orderPayment.installment_fee)}}
													</div>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="12">
                                                <el-form-item label="Down Payment">
													<div class="remove-line-height">
														Rp. {{formatPrice(itemDataDetail.orderPayment.down_payment)}}
													</div>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="12">
                                                <el-form-item label="Total">
													<div class="remove-line-height">
														Rp. {{formatPrice(itemDataDetail.orderPayment.total)}}
													</div>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="12">
                                                <el-form-item label="Interest">
													<div class="remove-line-height">
														{{itemDataDetail.orderPayment.interest}}
													</div>
                                                </el-form-item>
                                            </el-col>
										</el-row>
                                    </div>
								</div>
								<div class="item-forms-details" v-if="itemDataDetail.orderProducts">
                                    <div class="forms-details">
										<h4 class="title">Order Product</h4>
										<div class="mobayar-table mobayar-table-v2">
											<table style="width: 100%;" v-if="(itemDataDetail.orderProducts).length !== 0">
												<thead>
													<tr>
														<th width="350">Product</th>
														<th>Price</th>
														<th>Weight</th>
														<th width="100" align="center">Qty</th>
													</tr>
												</thead>
												<tbody>
													<tr v-for="(dataDetail, indexDetail) in itemDataDetail.orderProducts"
														:key="indexDetail">
														<td>
															<div v-if="dataDetail.product">
																{{dataDetail.product.name}}
															</div>
														</td>
														<td>Rp. {{formatPrice(dataDetail.price)}}</td>
														<td>{{dataDetail.weight}}</td>
														<td>{{dataDetail.qty}}</td>
													</tr>
												</tbody>
											</table>
										</div>
                                    </div>
								</div>
                            </el-form>
                        </section>
                    </div>
                    <div class="actions-button clearfix">
                        <el-button class="button-outline-black" @click="closeModal()">Batal</el-button>
                        <el-button v-if="itemDataDetail.status !== 'success' || itemDataDetail.status !== 'failed'" v-show="(formsType == 'edit')" class="button-white-green" id="save-edit" @click.prevent="submitSave()">Update Status</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { faSync } from '@fortawesome/free-solid-svg-icons'
import pageHeader from '@/components/pageHeader'
import loadingSvg from '@/components/loadingSvg'

export default {
    name: 'shipping-order',
    components: { pageHeader, loadingSvg },
    data(){
        return{
			sectionApi: "order",
			sectionApiCourier: "shipping/courierService",
			sectionApiProvince: "location/province",
            limit: 10,
            page: 1,
            loading: false,
			loadingForm: false,
			loadingCourier: false,
			loadingProvince: false,
			itemsData: [],
			itemsDataCourier: [],
			itemsDataProvince: [],
            itemDataDetail: [],
            totalPage: 0,
            searchQuery: "",
            titleForms: "",
            formsType: "",
            messagesuccess: "",
            messageerror: "",
            forms: {
				etd: "",
				nominal: "",
				courier_service_id: "",
				province_id: "",
            },
            rules: {
				etd: [ { required: true, message: "Inputan Harus diisi", trigger: "blur" } ],
				nominal: [ { required: true, message: "Inputan Harus diisi", trigger: "blur" } ],
				courier_service_id: [ { required: true, message: "Inputan Harus diisi", trigger: "change" } ],
				province_id: [ { required: true, message: "Inputan Harus diisi", trigger: "change" } ],
            },
            dataTextCreate: "Buat Kurir - Rate",
            dataTextUpdate: "Detail Order List",
            confirmDescDelete: "Anda yakin akan menghapus data Kurir - Rate dari daftar?",
            confirmTitleDelete: "Hapus Kurir - Rate",
            textDataCreateSuccess: "Data Kurir - Rate Berhasil ditambahkan.",
            textDataUpdateSuccess: "Order List Berhasil di Update",
			textDataDeleteSuccess: "1 Items Berhasil dihapus.",
			fontsIcons: {
				sync: faSync
			},
			statusChange: "",
        }
    },
    created(){
        this.$FUNCTIONS.checkPermissions(this.$dataRole['.cms.location.province.get'])
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
                return this.$baseUrl + this.sectionApi + "?limit=" + this.limit + "&page=" + this.page + "&search=" + this.searchQuery + "&order=status"
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
                    document.getElementById("save-edit").children[0].innerHTML = "Update Status"
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
						this.statusChange = this.itemDataDetail.status
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
                // if(this.$dataRole['.cms.location.province.*.get']){
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
        submitSave() {
			if(this.itemDataDetail.status == "waiting_payment" && this.statusChange == "success"){
				this.$FUNCTIONS.notify("error", "Maaf", "Order list belum bisa di selesaikan karena terkendala pembayaran")
			}else if(this.itemDataDetail.status == "waiting_payment" && this.statusChange == "failed"){
				this.confirmPost()
			}else{
				if(this.statusChange == "success" || this.statusChange == "failed"){
					this.confirmPost()
				}else{
					this.$FUNCTIONS.notify("error", "Maaf", "status belum di rubah")
				}
			}
		},
		confirmPost(){
			this.$confirm("Apakah anda yakin mengganti status order?", "Ganti Status Order", {
				confirmButtonText: "OK",
				cancelButtonText: "Cancel",
				type: "warning"
			}).then(() => {
				let loadingform = this.$FUNCTIONS.svgSpinner
				document.getElementById("save-edit").children[0].innerHTML = loadingform
				let urlv = this.buildUrl(false) + "/" + this.itemDataDetail.id
				let dataForm = {
					status: this.statusChange
				}
				this.postFunction("put", dataForm, urlv)
			});
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
			this.statusChange = ""
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
		searchCity(query){
			if (query !== '') {
				this.loadingCity = true
				setTimeout(() => {
					this.loadingCity = false
					this.getPostCity(query)
				}, 1000)
			}else{
				setTimeout(() => this.getPostCity(''), 1000)
			}
		},
    }
}
</script>
<style>
	.remove-line-height{
		line-height: normal;
	}
</style>
