<template>
    <div class="content-wrapper">
        <div id="purchase-order">
            <page-header titleName="Pengembalian Barang" :isCreate="true"></page-header>
            <div class="content">
                <div class="filterSearching clearfix">
                    <div class="input-with-icons clearfix">
                        <el-input v-model="searchQuery" class="float-left"></el-input>
                        <img :src="require('@/assets/images/icons/search1.png')">
                    </div>
					<el-date-picker
                        class="date-range-picker"
                        v-model="dateRange"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="Start date"
                        end-placeholder="End date"
                        :format="format"
                        :value-format="format">
					</el-date-picker>
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
                    v-loading="loading"
                    class="mobayar-table">
					<!-- <el-table-column type="selection" width="55"></el-table-column> -->
					<el-table-column label="Details" width="70" type="expand">
						<template slot-scope="scope">
							<div class="mobayar-table mobayar-table-v2">
								<table style="width: 100%;" v-if="(scope.row.detail).length !== 0">
									<thead>
										<tr>
											<th width="350">Item</th>
											<th width="100" align="center">Qty</th>
											<th>Reason</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="(dataDetail, indexDetail) in scope.row.detail"
											:key="indexDetail">
											<td>
												<div v-if="dataDetail.item">
													<div><b>Kode</b> : {{dataDetail.item.code}}</div>
													<div><b>Nama</b> : {{dataDetail.item.name}}</div>
													<div><b>N. Mesin</b> : {{dataDetail.item.machine_number}}</div>
													<div><b>N. Rangka</b> : {{dataDetail.item.chassis_number}}</div>
													<div>
														<b>Warna</b> :
														<span v-if="dataDetail.item.colour">
															{{dataDetail.item.colour.name}}
														</span>
													</div>
												</div>
											</td>
											<td>{{dataDetail.qty}}</td>
											<td>{{dataDetail.reason}}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</template>
					</el-table-column>
                    <el-table-column label="Number" prop="number"></el-table-column>
					<el-table-column label="No Nota dari Toko" prop="store_delivery_number"></el-table-column>
					<el-table-column label="From" prop="from"></el-table-column>
					<el-table-column label="Unit Barang">
						<template slot-scope="scope">
							{{(scope.row.detail).length}} Unit
						</template>
					</el-table-column>
					<el-table-column label="Warehouse Penerima">
						<template slot-scope="scope">
							<div v-if="scope.row.warehouseReceiver">
								{{scope.row.warehouseReceiver.name}}<br>
								{{scope.row.warehouseReceiver.address}}<br>
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
									<h5 style="margin-bottom: 15px;">Periode Surat Jalan</h5>
									<div class="forms-details" style="margin-top:0;">
										<el-row :gutter="20">
											<el-col :span="12">
												<div class="select-prepend">
													<div class="el-input-group__prepend">Start Date</div>
													<el-select
														@change="periodChange"
														v-model="forms.periodFirstPO">
														<el-option
															v-for="(data, index) in getYearData"
															:key="index"
															:value="data"
															:label="data"></el-option>
													</el-select>
												</div>
											</el-col>
											<el-col :span="12">
												<el-input disabled v-model="forms.periodLastPO">
													<template slot="prepend">End Date</template>
												</el-input>
											</el-col>
										</el-row>
									</div>
								</div>
                                <div class="item-forms-details">
                                    <div class="forms-details">
                                        <el-row :gutter="20">
                                            <el-col :span="12">
                                                <el-form-item :label="(forms.periodFirstPO === forms.periodLastPO) ? ('Data Surat Jalan (' + forms.periodFirstPO + ')') : ('Data Surat Jalan (' + forms.periodFirstPO + '-' + forms.periodLastPO + ')')">
													<el-select
														@change="suratJalanChange"
														v-model="forms.sale_id"
														filterable>
														<el-option
															v-for="(dataSale, indexSale) in itemsDataSale"
															:key="indexSale"
															:value="dataSale.id"
															:label="dataSale.number"></el-option>
													</el-select>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="12">
                                                <el-form-item label="Warehouse Penerima">
													<el-select v-model="forms.warehouse_receiver_id">
														<el-option
															v-for="(dataWarehouse, indexWarehouse) in itemsDataWarehouse"
															:key="indexWarehouse"
															:value="dataWarehouse.id"
															:label="dataWarehouse.name"></el-option>
													</el-select>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="12">
                                                <el-form-item label="From">
													<el-input v-model="forms.from"></el-input>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="12">
                                                <el-form-item label="No Nota dari Toko">
													<el-input v-model="forms.store_delivery_number"></el-input>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
								<div class="item-forms-details">
									<h5>Input Produk Item</h5>
									<div class="forms-details" style="position: relative;">
										<!-- <div class="barang-content clearfix"> -->
										<!-- <a href="#" @click.prevent="formsProduct.push({
											item_all: '',
											item_ids: '',
											item_qtys: '',
											item_reasons: '',
										})" class="plus-items"><font-awesome-icon class="fontIcons" :icon="fontsIcons.plus" /></a> -->
										<el-table
											:data="formsProduct"
											max-height="530"
											empty-text="No data available in table"
											ref="singleTableItems"
											class="mobayar-table"
											@selection-change="handleSelectionChange">
											<el-table-column type="selection" width="65"></el-table-column>
											<el-table-column width="220" label="Item">
												<template slot-scope="scope">
													<!-- <el-select
														v-model="formsProduct[scope.$index].item_ids"
														placeholder="Pilih Item Produk"
														:popper-append-to-body="false"
														class="custom-select-width"
														filterable>
														<el-option
															v-for="(dataProduct, indexProduct) in itemsDataProductItem"
															:key="indexProduct"
															:label="dataProduct.chassis_number"
															:value="dataProduct.id">
															<div>
																<b>Kode</b> :
																<span v-if="dataProduct.code !== null">{{dataProduct.code}}</span>
																<span v-else>-</span>
															</div>
															<div>
																<b>Nama</b> :
																<span v-if="dataProduct.name !== null">{{dataProduct.name}}</span>
																<span v-else>-</span>
															</div>
															<div>
																<b>N.Mesin</b> :
																<span v-if="dataProduct.machine_number !== null">{{dataProduct.machine_number}}</span>
																<span v-else>-</span>
															</div>
															<div>
																<b>N.Rangka</b> :
																<span v-if="dataProduct.chassis_number !== null">{{dataProduct.chassis_number}}</span>
																<span v-else>-</span>
															</div>
															<div>
																<b>Warna</b> :
																<span v-if="dataProduct.colour">{{dataProduct.colour.name}}</span>
																<span v-else>-</span>
															</div>
														</el-option>
													</el-select> -->
													<div v-if="scope.row.item_all">
														<div>
															<b>Kode</b> :
															<span>{{scope.row.item_all.item.code}}</span>
														</div>
														<div>
															<b>Nama</b> :
															<span>{{scope.row.item_all.item.name}}</span>
														</div>
														<div>
															<b>N. Mesin</b> :
															<span>{{scope.row.item_all.item.machine_number}}</span>
														</div>
														<div>
															<b>N. Rangka</b> :
															<span>{{scope.row.item_all.item.chassis_number}}</span>
														</div>
														<div>
															<b>Warna</b> :
															<span v-if="scope.row.item_all.item.colour">{{scope.row.item_all.item.colour.name}}</span>
														</div>
													</div>
												</template>
											</el-table-column>
											<el-table-column width="80" label="Qty">
												<template slot-scope="scope">
													<el-input :disabled="true" v-model="formsProduct[scope.$index].item_qtys"></el-input>
												</template>
											</el-table-column>
											<el-table-column label="Notes">
												<template slot-scope="scope">
													<el-input
														type="textarea"
														rows="3"
														v-model="formsProduct[scope.$index].item_reasons"></el-input>
												</template>
											</el-table-column>
											<!-- <el-table-column align="center" v-if="formsType !== 'edit'" label="Hapus">
												<template slot-scope="scope">
													<a href="#" @click.prevent="removeProductInput(scope.$index)" class="minus-items"><font-awesome-icon class="fontIcons" :icon="fontsIcons.minus" /></a>
												</template>
											</el-table-column> -->
										</el-table>
										<!-- <pre>{{itemIdReals}}</pre> -->
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

				<table border="1" style="width: 100%;display:none;" id="table-export-return">
					<thead>
                        <tr>
                            <th>Nomor</th>
                            <th>No Nota dari Toko</th>
							<th>From</th>
							<th>Unit Barang</th>
							<th>Warehouse Penerima</th>
							<th>Alamat Warehouse Penerima</th>
							<th>Nama Item</th>
							<th>Kode Item</th>
							<th>Nomor Rangka Item</th>
							<th>Nomor Mesin Item</th>
							<th>Qty Item</th>
							<th>Reason</th>
                        </tr>
                    </thead>
					<tbody
						v-for="(dataExport, indexExport) in itemDataExport"
						:key="indexExport">
						<tr>
                            <td :rowspan="(dataExport.detail).length + 1">{{dataExport.number}}</td>
							<td :rowspan="(dataExport.detail).length + 1">{{dataExport.store_delivery_number}}</td>
							<td :rowspan="(dataExport.detail).length + 1">{{dataExport.from}}</td>
							<td :rowspan="(dataExport.detail).length + 1">{{(dataExport.detail).length}}</td>
							<td :rowspan="(dataExport.detail).length + 1">
								<span v-if="dataExport.warehouseReceiver">{{dataExport.warehouseReceiver.name}}</span>
								<span v-else>-</span>
							</td>
							<td :rowspan="(dataExport.detail).length + 1">
								<span v-if="dataExport.warehouseReceiver">{{dataExport.warehouseReceiver.address}}</span>
								<span v-else>-</span>
							</td>
							<td :rowspan="((dataExport.detail).length !== 0) ? '2' : '1'">
								<div v-if="(dataExport.detail).length !== 0">
									<div v-if="dataExport.detail[0].item !== null">{{dataExport.detail[0].item.name}}</div>
								</div>
								<div v-else>-</div>
							</td>
							<td :rowspan="((dataExport.detail).length !== 0) ? '2' : '1'">
								<div v-if="(dataExport.detail).length !== 0">
									<div v-if="dataExport.detail[0].item !== null">{{dataExport.detail[0].item.code}}</div>
								</div>
								<div v-else>-</div>
							</td>
							<td :rowspan="((dataExport.detail).length !== 0) ? '2' : '1'">
								<div v-if="(dataExport.detail).length !== 0">
									<div v-if="dataExport.detail[0].item !== null">{{dataExport.detail[0].item.chassis_number}}</div>
								</div>
								<div v-else>-</div>
							</td>
							<td :rowspan="((dataExport.detail).length !== 0) ? '2' : '1'">
								<div v-if="(dataExport.detail).length !== 0">
									<div v-if="dataExport.detail[0].item !== null">{{dataExport.detail[0].item.machine_number}}</div>
								</div>
								<div v-else>-</div>
							</td>
							<td :rowspan="((dataExport.detail).length !== 0) ? '2' : '1'">
								<div v-if="(dataExport.detail).length !== 0">
									<div v-if="dataExport.detail[0].qty !== null">
										{{dataExport.detail[0].qty}}
									</div>
								</div>
								<div v-else>-</div>
							</td>
							<td :rowspan="((dataExport.detail).length !== 0) ? '2' : '1'">
								<div v-if="(dataExport.detail).length !== 0">
									<div v-if="dataExport.detail[0].reason !== null">
										{{dataExport.detail[0].reason}}
									</div>
								</div>
								<div v-else>-</div>
							</td>
						</tr>
						<tr v-for="(dataDetails, indexDetails) in dataExport.detail" :key="indexDetails">
                            <td v-if="indexDetails > 0">
                                <div v-if="dataDetails.item">{{dataDetails.item.name}}</div>
                                <div v-else>-</div>
                            </td>
							<td v-if="indexDetails > 0">
                                <div v-if="dataDetails.item">{{dataDetails.item.code}}</div>
                                <div v-else>-</div>
                            </td>
							<td v-if="indexDetails > 0">
                                <div v-if="dataDetails.item">{{dataDetails.item.chassis_number}}</div>
                                <div v-else>-</div>
                            </td>
							<td v-if="indexDetails > 0">
                                <div v-if="dataDetails.item">{{dataDetails.item.machine_number}}</div>
                                <div v-else>-</div>
                            </td>
                            <td v-if="indexDetails > 0">
                                <div v-if="dataDetails.qty">{{dataDetails.qty}}</div>
                                <div v-else>-</div>
                            </td>
							<td v-if="indexDetails > 0">
                                <div v-if="dataDetails.reason">{{dataDetails.reason}}</div>
                                <div v-else>-</div>
                            </td>
                        </tr>
					</tbody>
				</table>
            </div>
        </div>
    </div>
</template>

<script>
import {
    faPlusCircle,
    faTrash,
} from '@fortawesome/free-solid-svg-icons'
import XLSX from 'xlsx'
import pageHeader from '@/components/pageHeader'
import loadingSvg from '@/components/loadingSvg'

let date = new Date()
let firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

let getfirstLastDateofYear = new Date().getFullYear() - 1
let getfirstDateofYear = new Date(getfirstLastDateofYear, 0, 1)
let getlastDateofYear = new Date(new Date().getFullYear(), 11, 31)

let getFirstYear = new Date(getfirstDateofYear).getFullYear()
let getLastYear = new Date(getlastDateofYear).getFullYear()

export default {
    name: 'delivery-return',
    components: { pageHeader, loadingSvg },
    data(){
        return{
			sectionApi: "return",
			sectionApiSale: "sale",
			sectionApiWarehouse: "warehouse",
			sectionApiItemProduct: "item",
            limit: 10,
            page: 1,
            loading: false,
			loadingForm: false,
			loadingExcel: false,
			itemsData: [],
			itemsDataSale: [],
			itemsDataWarehouse: [],
			itemsDataProductItem: [],
			itemDataDetail: [],
			itemDataExport: [],
            totalPage: 0,
            searchQuery: "",
            titleForms: "",
            formsType: "",
            messagesuccess: "",
			messageerror: "",
			productItemsCount: 1,
			itemIdReals: [],
			dateRange: [this.$FUNCTIONS.formatDate(firstDay), this.$FUNCTIONS.formatDate(lastDay)],
			format: 'yyyy-MM-dd',
			dateRangeYear: [this.$FUNCTIONS.formatDate(getfirstDateofYear), this.$FUNCTIONS.formatDate(getlastDateofYear)],
            forms: {
				sale_id: "",
				warehouse_receiver_id: "",
				from: "",
				store_delivery_number: "",
				periodFirstPO: getFirstYear,
				periodLastPO: getLastYear,
			},
			formsProduct: [],
            rules: {
                sale_id: [ { required: true, message: "Inputan Harus diisi", trigger: "blur" } ],
			},
			readOnly:{
				item_ids: [],
				item_qtys: [],
				item_reasons: []
            },
            dataTextCreate: "Buat Pengembalian Barang",
            dataTextUpdate: "Edit Pengembalian Barang",
            confirmDescDelete: "Anda yakin akan menghapus data Pengembalian Barang dari daftar?",
            confirmTitleDelete: "Hapus Pengembalian Barang",
            textDataCreateSuccess: "Data Pengembalian Barang Berhasil ditambahkan.",
            textDataUpdateSuccess: "Data Pengembalian Barang Berhasil diupdate.",
			textDataDeleteSuccess: "1 Items Berhasil dihapus.",
			fontsIcons:{
                plus: faPlusCircle,
				minus: faTrash
            },
        }
    },
    created(){
        this.$FUNCTIONS.checkPermissions(this.$dataRole['.cms.return.get'])
    },
    mounted(){
		this.getPost()
		this.getPostItem()
		this.getPostSale()
		this.getPostWarehouse()
        this.initCreateFunction()
    },
    watch: {
        searchQuery: function(){
            this.getResult()
            this.$FUNCTIONS.checkPaginations()
		},
		dateRange(){
			this.getPost()
            this.$FUNCTIONS.checkPaginations()
		}
    },
    methods:{
        buildUrl(value){
            if(value == true){
				return this.$baseUrl + this.sectionApi
					   + "?limit=" + this.limit
					   + "&page=" + this.page
					   + "&search=" + this.searchQuery
					   + "&start_date=" + this.dateRange[0]
					   + "&end_date=" + this.dateRange[1]
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
		async getPostSale(){
            try{
				let url = this.$baseUrl + this.sectionApiSale + "?limit=1000&page=1"
						+ "&start_date=" + this.dateRangeYear[0]
					    + "&end_date=" + this.dateRangeYear[1]
				const response = await this.$services.getList(url)
				this.loadingForm = false
                if(response.status == 200){
                    this.itemsDataSale = response.data.data
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
		},
		async getPostWarehouse(){
            try{
				let url = this.$baseUrl + this.sectionApiWarehouse + "?limit=100&page=1"
                const response = await this.$services.getList(url)
                if(response.status == 200){
                    this.itemsDataWarehouse = response.data.data
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
		},
		async getPostItem(){
            try{
				let url = this.$baseUrl + this.sectionApiItemProduct + "?limit=1000&page=1"
                const response = await this.$services.getList(url)
                if(response.status == 200){
                    this.itemsDataProductItem = response.data.data
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
		async getExcel(){
			if(this.itemsData.length != 0){
				try{
					this.loadingExcel = true
					this.limit = this.totalPage
					this.page = 1
					let url = this.buildUrl(true)
					const response = await this.$services.getList(url)
					this.loadingExcel = false
					if(response.status == 200){
						this.itemDataExport = response.data.data

						let that = this
						setTimeout(function(){
							that.loadingExcel = false
							var wscols = [
								{wch:25},
								{wch:25},
								{wch:20},
								{wch:30},
								{wch:20},
								{wch:30},
								{wch:20},
								{wch:20},
								{wch:20},
								{wch:20},
								{wch:20},
								{wch:20},
							];
							var datas = XLSX.utils.table_to_sheet(document.getElementById('table-export-return'))
							datas['!cols'] = wscols;
							var wb = XLSX.utils.book_new()
							let filename = "pengembalian-barang-jarvis"
							XLSX.utils.book_append_sheet(wb, datas, 'Pengembalian Barang')
							XLSX.writeFile(wb, filename+'.xlsx')
						}, 1000)
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

			let dataItemId = []
			let dataQtyItem = []
			let dataNotes = []

			if(this.itemIdReals.length !== 0){
				this.itemIdReals.forEach(function(e){
					dataItemId.push(e.item_ids)
					dataQtyItem.push(e.item_qtys)
					dataNotes.push(e.item_reasons)
				})

				let dataForms = {
					sale_id: this.forms.sale_id,
					warehouse_receiver_id: this.forms.warehouse_receiver_id,
					from: this.forms.from,
					store_delivery_number: this.forms.store_delivery_number,
					item_ids: dataItemId,
					item_qtys: dataQtyItem,
					item_reasons: dataNotes,
				}

				this.$refs[formName].validate(valid => {
					if (valid) {
						if(formtype == "save") {
							document.getElementById("save").children[0].innerHTML = loadingform
							this.postFunction("post", dataForms, this.buildUrl(false))
						}else{
							document.getElementById("save-edit").children[0].innerHTML = loadingform
							let urlv = this.buildUrl(false) + "/" + this.itemDataDetail.id
							this.postFunction("put", this.forms, urlv)
						}
					}
				})
			}else{
				this.$FUNCTIONS.notify('error', 'Error', 'Pilih item untuk input pengembalian barang')
			}
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
			this.itemIdReals = []
			this.forms.sale_id = ""
			this.forms.warehouse_receiver_id = ""
			this.forms.from = ""
			this.forms.store_delivery_number = ""
			this.formsProduct = []
			this.forms.periodFirstPO = getFirstYear
			this.forms.periodLastPO = getLastYear
			this.dateRangeYear = [this.$FUNCTIONS.formatDate(getfirstDateofYear), this.$FUNCTIONS.formatDate(getlastDateofYear)]
			this.getPostSale()
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
		removeProductInput(index){
			this.productItemsCount--
			this.formsProduct.splice(index, 1)
		},
		searchArray(nameKey, myArray){
            for (var i=0; i < myArray.length; i++) {
                if (myArray[i].id === nameKey) {
                    return myArray[i];
                }
            }
		},
		suratJalanChange(val){
			this.formsProduct = []
			let datas = this.searchArray(val, this.itemsDataSale)
			datas.details.forEach(function(e){
				this.formsProduct.push({
					item_all: e,
					item_ids: e.item_id,
					item_qtys: e.qty,
					item_reasons: '',
				})
			}, this)
		},
		handleSelectionChange(val){
			this.itemIdReals = val
		},
		periodChange(value){
			let newDate = new Date(this.dateRangeYear[0])
			newDate.setFullYear(value)
			this.dateRangeYear[0] = this.$FUNCTIONS.formatDate(newDate)
			this.loadingForm = true
			this.getPostSale()
		}
	},
	computed:{
		getYearData: function(){
			let value = []
			let start_year = new Date().getFullYear()

			for (var i = start_year; i > start_year - 5; i--) {
				value.push(i)
			}

			return value
		}
	}
}
</script>
<style lang="scss" scoped>
.barang-content{
    position: relative;
}
.plus-items{
    position: absolute;
    right: -15px;
    z-index: 10;
    top: -10px;
    .fontIcons{
        font-size: 24px;
        color: #800080 !important;
    }
}
.minus-items{
    .fontIcons{
        font-size: 16px !important;
        color: #800080 !important;
    }
}
</style>
