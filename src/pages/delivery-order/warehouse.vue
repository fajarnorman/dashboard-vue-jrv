<template>
    <div class="content-wrapper">
        <div id="delivery-order-store">
            <page-header titleName="Pindah Warehouse" :isCreate="true"></page-header>
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
                    @current-change="handleCurrentChange"
                    v-loading="loading"
                    class="mobayar-table">
                    <el-table-column label="Delivery Order Number" prop="number"></el-table-column>
                    <el-table-column label="Jumlah Item yang dipindah">
                        <template slot-scope="scope">
                            <div v-if="scope.row.detail">
                                {{(scope.row.detail).length}} unit
                            </div>
                        </template>
                    </el-table-column>
					<el-table-column label="Warehouse Asal">
                        <template slot-scope="scope">
							<div v-if="scope.row.warehouseFrom">
								{{scope.row.warehouseFrom.name}}<br>
								{{scope.row.warehouseFrom.address}}
							</div>
                        </template>
					</el-table-column>
					<el-table-column label="Warehouse Penerima">
                        <template slot-scope="scope">
							<div v-if="scope.row.warehouseReceiver">
								{{scope.row.warehouseReceiver.name}}<br>
								{{scope.row.warehouseReceiver.address}}
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
											<el-col :span="12">
                                                <el-form-item label="Warehouse Asal" prop="warehouse_from_id">
                                                    <el-select
														v-model="forms.warehouse_from_id"
														@change="wareHouseItemChange"
														placeholder="Pilih Warehouse Asal">
                                                        <el-option
															v-for="(dataWarehouseFrom, indexWarehouseFrom) in itemsDataWarehouse"
															:key="indexWarehouseFrom"
															:value="dataWarehouseFrom.id"
															:label="dataWarehouseFrom.name"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="12">
                                                <el-form-item label="Warehouse Penerima" prop="warehouse_receiver_id">
                                                    <el-select v-model="forms.warehouse_receiver_id" placeholder="Pilih Warehouse Penerima">
                                                        <el-option
															v-for="(dataWarehouseReceived, indexWarehouseReceived) in itemsDataWarehouse"
															:key="indexWarehouseReceived"
															:value="dataWarehouseReceived.id"
															:label="dataWarehouseReceived.name"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Notes">
                                                    <el-input v-model="forms.note" type="textarea" :rows="5"></el-input>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
								<div class="item-forms-details">
									<h5>Input Produk Item</h5>
									<div class="forms-details">
										<div class="barang-content clearfix" style="position: relative;">
											<a href="#" v-if="formsType !== 'edit'" @click.prevent="addRow()" class="plus-items"><font-awesome-icon class="fontIcons" :icon="fontsIcons.plus" /></a>
											<div class="el-table mobayar-table">
												<table cellspacing="0" cellpadding="0">
													<thead>
														<tr>
															<th width="220">Item</th>
															<!-- <th width="300">Detail Items</th> -->
															<th width="150">Qty</th>
															<th v-if="formsType !== 'edit'" align="center">Hapus</th>
														</tr>
													</thead>
													<tbody>
														<tr
															v-for="(itemProduct, indexProduct) in formsProduct.item_ids"
															:key="indexProduct">
															<td>
																<div v-if="formsProduct.item_desc[indexProduct]">
																	<div>
																		<b>Kode</b> : {{formsProduct.item_desc[indexProduct].code}}
																	</div>
																	<div>
																		<b>Nama</b> : {{formsProduct.item_desc[indexProduct].name}}
																	</div>
																	<div>
																		<b>N. Rangka</b> : {{formsProduct.item_desc[indexProduct].chassis_number}}
																	</div>
																	<div>
																		<b>N. Mesin</b> : {{formsProduct.item_desc[indexProduct].machine_number}}
																	</div>
																	<div>
																		<b>Warna</b> : <span v-if="formsProduct.item_desc[indexProduct].colour">{{formsProduct.item_desc[indexProduct].colour.name}}</span>
																	</div>
																	<a href="#" v-if="formsType == 'create'" @click.prevent="openModelItem(itemProduct, formsProduct.item_qtys[indexProduct], indexProduct)">Edit Item</a>
																</div>
																<el-button
																	v-if="formsProduct.item_desc[indexProduct] == ''"
																	class="button-white-green"
																	round
																	@click.prevent="openModelItem('', '', indexProduct)">
																	Pilih Item
																</el-button>
															</td>
															<td>
																<div v-if="formsProduct.item_qtys[indexProduct] !== ''">{{formsProduct.item_qtys[indexProduct]}}</div>
															</td>
															<td v-if="formsType !== 'edit'" align="center">
																<a href="#" @click.prevent="removeProductInput(indexProduct)" class="minus-items"><font-awesome-icon class="fontIcons" :icon="fontsIcons.minus" /></a>
															</td>
														</tr>
													</tbody>
												</table>
												<!-- <pre>{{formsProduct}}</pre> -->
											</div>
										</div>
									</div>
								</div>
                            </el-form>
                        </section>
                    </div>
                    <div class="actions-button clearfix">
                        <el-button class="button-outline-black" @click="closeModal()">Batal</el-button>
                        <el-button v-show="(formsType != 'edit')" class="button-white-green" id="save" @click.prevent="submitSave('formsvalid', 'save')">Simpan</el-button>
                    </div>
                </div>

				<el-dialog
					:title="'Pilih Item'"
					:visible.sync="modalItem"
					width="50%"
					top="5vh"
					class="mb-dialog nopadding-right point-modal kepala-regional">
					<div class="content-dialog detail-pencapaian" style="overflow: visible;">
						<loading-svg :isLoading="loadingModal"></loading-svg>
						<div class="filterable">
							<!-- <h4>Filter Item : </h4> -->
							<!-- <div class="item-filter" v-if="modalFilterColour !== ''">
								<label>Warna</label>
								<el-select v-model="modalFilterColour">
									<el-option
										v-for="(dataColour, indexColour) in itemsDataColour"
										:key="indexColour+'colour'"
										:label="dataColour.name"
										:value="dataColour.id"></el-option>
								</el-select>
							</div>
							<div class="item-filter">
								<label>Status</label>
								<el-select v-model="modalFilterStatus">
									<el-option label="Semua Status" value=" "></el-option>
									<el-option label="Warehouse" value="warehouse"></el-option>
									<el-option label="Toko" value="store"></el-option>
									<el-option label="User" value="user"></el-option>
								</el-select>
							</div> -->
							<!-- <div class="item-filter">
								<label>Tipe</label>
								<el-select v-model="modalFilterTipe">
									<el-option value="" label="Semua Tipe"></el-option>
									<el-option value="bike" label="Bike"></el-option>
									<el-option value="sparepart" label="Sparepart"></el-option>
								</el-select>
							</div> -->
							<!-- <div class="item-filter">
								<label>Warehouse</label>
								<el-select v-model="modalFilterWarehouse">
									<el-option value="" label="Semua Warehouse"></el-option>
									<el-option
										v-for="(dataWarehouse, indexWarehouse) in itemsDataWarehouse"
										:key="indexWarehouse+'warehouse'"
										:label="dataWarehouse.name"
										:value="dataWarehouse.id"></el-option>
								</el-select>
							</div> -->
						</div>
						<el-row :gutter="20">
							<el-col :span="12">
								<div class="item-fill">
									<label>Item</label>
									<el-select
										v-model="modalitemsIds"
										placeholder="Pilih Item"
										:popper-append-to-body="false"
										class="custom-select-width"
										style="width: 100%;"
										filterable
										remote
										:remote-method="remoteMethodItems"
										:loading="loadingItemsDataPopup">
										<el-option
											v-for="(dataProduct, indexProduct) in itemsProductItems"
											:key="indexProduct"
											:label="dataProduct.chassis_number"
											:value="dataProduct.id">
											<div>
												<b>Kode</b> : {{dataProduct.code}}
											</div>
											<div>
												<b>Nama</b> : {{dataProduct.name}}
											</div>
											<div>
												<b>N. Rangka</b> : {{dataProduct.chassis_number}}
											</div>
											<div>
												<b>N. Mesin</b> : {{dataProduct.machine_number}}
											</div>
											<div>
												<b>Warna</b> :
												<span v-if="dataProduct.colour">{{dataProduct.colour.name}}</span>
											</div>
										</el-option>
									</el-select>
								</div>
							</el-col>
							<el-col :span="12">
								<div class="item-fill">
									<label>Qty</label>
									<el-input-number type="number" disabled :min="0" v-model="modalitemQtys"></el-input-number>
								</div>
							</el-col>
						</el-row>
					</div>
					<span slot="footer" class="dialog-footer">
						<el-button round class="button-white-green" @click.prevent="acceptItem()" type="primary">Submit</el-button>
					</span>
				</el-dialog>

				<table border="1" style="width: 100%;display:none;" id="table-export-delivery-order">
					<thead>
                        <tr>
                            <th>Delivery Order Number</th>
                            <th>Jumlah Item yang dipindah</th>
							<th>Warehouse Asal</th>
							<th>Alamat Warehouse Asal</th>
							<th>Warehouse Penerima</th>
							<th>Alamat Warehouse Penerima</th>
							<th>Nama Item</th>
							<th>Kode Item</th>
							<th>Nomor Rangka Item</th>
							<th>Nomor Mesin Item</th>
							<th>Warna Item</th>
                        </tr>
                    </thead>
					<tbody
						v-for="(dataExport, indexExport) in itemsDetailExcel"
						:key="indexExport">
						<tr>
                            <td :rowspan="(dataExport.detail).length + 1">
								{{dataExport.number}}
							</td>
							<td :rowspan="(dataExport.detail).length + 1">
								{{(dataExport.detail).length}}
							</td>
							<td :rowspan="(dataExport.detail).length + 1">
								<span v-if="dataExport.warehouseFrom">{{dataExport.warehouseFrom.name}}</span>
							</td>
							<td :rowspan="(dataExport.detail).length + 1">
								<span v-if="dataExport.warehouseFrom">{{dataExport.warehouseFrom.address}}</span>
							</td>
							<td :rowspan="(dataExport.detail).length + 1">
								<span v-if="dataExport.warehouseReceiver">{{dataExport.warehouseReceiver.name}}</span>
							</td>
							<td :rowspan="(dataExport.detail).length + 1">
								<span v-if="dataExport.warehouseReceiver">{{dataExport.warehouseReceiver.name}}</span>
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
									<div v-if="dataExport.detail[0].item !== null">
										<div v-if="dataExport.detail[0].item.colour !== null">{{dataExport.detail[0].item.colour.name}}</div>
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
								<div v-if="dataDetails.item">
									<div v-if="dataDetails.item.colour">{{dataDetails.item.colour.name}}</div>
									<div v-else>-</div>
								</div>
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

export default {
    name: 'delivery-order',
    components: { pageHeader, loadingSvg },
    data(){
		var validateWarehouseReceive = (rule, value, callback) => {
			if(value === ''){
				callback(new Error('Inputan Harus diisi'))
			}else{
				if(value === this.forms.warehouse_from_id){
					callback(new Error('Warehouse Penerima tidak boleh sama dengan warehouse asal'))
				}
				callback()
			}
		}
        return{
			sectionApi: "deliveryOrder",
			sectionApiWarehouse: "warehouse",
			sectionApiItemProduct: "item",
            limit: 10,
            page: 1,
            loading: false,
            loadingForm: false,
			loadingWarehouse: false,
			loadingExcel: false,
			itemsData: [],
			itemsDataWarehouse: [],
			itemDataDetail: [],
			itemsProductItems: [],
			itemsDetailExcel: [],
            totalPage: 0,
            searchQuery: "",
            titleForms: "",
            formsType: "",
            messagesuccess: "",
            messageerror: "",
            messageErrorProduct: "",
            dialogProduk: false,
			productItemsCount: 0,
			dateRange: [this.$FUNCTIONS.formatDate(firstDay), this.$FUNCTIONS.formatDate(lastDay)],
			format: 'yyyy-MM-dd',
            forms: {
				warehouse_from_id: "",
				warehouse_receiver_id: "",
				note: "",
            },
            formsProduct: {
				item_ids: [],
				item_qtys: [],
				item_desc: [],
            },
            readOnly:{
				item_ids: [],
				item_qtys: [],
            },
            rules: {
				warehouse_from_id: [ { required: true, message: "Inputan Harus diisi", trigger: "blur" } ],
				warehouse_receiver_id: [ { required: true, validator: validateWarehouseReceive, trigger: 'blur' } ],
            },
            dataTextCreate: "Buat Pindah Warehouse",
            dataTextUpdate: "Edit Pindah Warehouse",
            confirmDescDelete: "Anda yakin akan menghapus data Pindah Warehouse dari daftar?",
            confirmTitleDelete: "Hapus Pindah Warehouse",
            textDataCreateSuccess: "Data Pindah Warehouse Berhasil ditambahkan.",
            textDataUpdateSuccess: "Data Pindah Warehouse Berhasil diupdate.",
            textDataDeleteSuccess: "1 Items Berhasil dihapus.",
            fontsIcons:{
                plus: faPlusCircle,
				minus: faTrash
			},
			modalItem: false,
			modalitemsIds: '',
			modalitemQtys: 1,
			loadingItemsDataPopup: false,
			loadingModal: false,
			indexModalItem: '',
        }
    },
    created(){
        this.$FUNCTIONS.checkPermissions(this.$dataRole['.cms.deliveryorder.get'])
    },
    mounted(){
		this.getPost()
		this.getPostWarehouse()
		this.getPostItemProduk()
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
		async getPostWarehouse(){
            try{
                let url = this.$baseUrl + this.sectionApiWarehouse + "?limit=1000&page=1"
                this.loadingWarehouse = true
                const response = await this.$services.getList(url)
                this.loadingWarehouse = false
                if(response.status == 200){
                    this.itemsDataWarehouse = response.data.data
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
		},
		async getPostItemProduk(warehouseId, search){
            try{
				this.loadingItemsDataPopup = true
				let url = this.$baseUrl
						  + this.sectionApiItemProduct
						  + "?limit=25&page=1&status=warehouse&type=bike"
						  + "&warehouse_id=" + warehouseId
						  + "&chassis_number=" + search
				const response = await this.$services.getList(url)
				this.loadingItemsDataPopup = false
                if(response.status == 200){
                    this.itemsProductItems = response.data.data
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
				this.loadingForm = false
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
                    if(response.status == 201) {
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
            }
		},
		openModelItem(value, qty, index){
			if(this.forms.warehouse_from_id !== ''){
				this.modalitemsIds = value
				this.modalitemQtys = 1
				this.modalItem = true
				this.indexModalItem = index
				this.getPostItemProduk(this.forms.warehouse_from_id, '')
			}else{
				this.$FUNCTIONS.notify('error', 'Error', 'Maaf anda harus memilih Warehouse terlebih dahulu')
			}
		},
		remoteMethodItems(query){
			let that = this
			if (query !== '') {
				this.loadingItemsDataPopup = true
				setTimeout(function(){
					that.getPostItemProduk(that.forms.warehouse_from_id, query)
				}, 1500)
			}else{
				this.getPostItemProduk(this.forms.warehouse_from_id, '')
			}
		},
		acceptItem(){
			let that = this
			let errorDataIdItem = []
			this.formsProduct.item_ids.forEach(function(e){
				if(this.modalitemsIds == e){
					errorDataIdItem.push('error')
				}
			}, this)

			if(this.modalitemsIds !== '' && this.modalitemQtys !== ''){
				if(errorDataIdItem.length !== 0){
					this.$FUNCTIONS.notify('error', 'Error', 'Item produk sudah ada pada list')
				}else{
					let data = this.searchArray(this.modalitemsIds, this.itemsProductItems)
					this.formsProduct.item_ids.splice(this.indexModalItem, 1, this.modalitemsIds)
					this.formsProduct.item_qtys.splice(this.indexModalItem, 1, this.modalitemQtys)
					this.formsProduct.item_desc.splice(this.indexModalItem, 1, data)

					this.modalItem = false

					const resetVar = () => {
						this.modalitemsIds = ''
						this.modalitemQtys = 1
					}

					setTimeout(() => resetVar, 500)
				}
			}else{
				this.$FUNCTIONS.notify('error', 'Error', 'Form item harus lengkap')
			}
		},
		addRow(){
			if(this.forms.warehouse_from_id !== ''){
				this.formsProduct.item_ids.push('')
				this.formsProduct.item_qtys.push('')
				this.formsProduct.item_desc.push('')
			}else{
				this.$FUNCTIONS.notify('error', 'Error', 'Maaf anda harus memilih Warehouse terlebih dahulu')
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

                this.forms.warehouse_from_id = this.itemDataDetail.warehouse_from_id
				this.forms.warehouse_receiver_id = this.itemDataDetail.warehouse_receiver_id
				this.forms.note = this.itemDataDetail.note
				this.productItemsCount = (this.itemDataDetail.detail).length

				this.itemDataDetail.detail.forEach(function(e){
					this.formsProduct.item_ids.push(e.item_id)
					this.formsProduct.item_qtys.push(e.qty)
					this.formsProduct.item_desc.push(e.item)
				}, this)

                this.$FUNCTIONS.sidebarToggle(true)
            }
        },
        submitSave(formName, formtype) {
            let loadingform = this.$FUNCTIONS.svgSpinner
            this.messagesuccess = ""
			this.messageerror = ""
			let error = []

			this.formsProduct.item_ids.forEach((e, i) => {
				(e === '') ? error.push('error') : ''
			}, this)

			if(error.length !== 0){
				this.$FUNCTIONS.notify('error', 'Error', 'Mohon pilih item untuk melengkapi data')
			}else{
				let dataForms = {
					warehouse_from_id: this.forms.warehouse_from_id,
					warehouse_receiver_id: this.forms.warehouse_receiver_id,
					note: this.forms.note,
					item_ids: this.formsProduct.item_ids,
					item_qtys: this.formsProduct.item_qtys
				}

				this.$refs[formName].validate(valid => {
					if (valid) {
						if(formtype == "save") {
							document.getElementById("save").children[0].innerHTML = loadingform
							this.postFunction("post", dataForms, this.buildUrl(false))
						}
					}
				})
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
			this.productItemsCount = 1
			this.productItemsCountEdit = 0
            this.forms.warehouse_from_id = ""
			this.forms.warehouse_receiver_id = ""
			this.forms.note = ""
			this.formsProduct.item_ids = []
			this.formsProduct.item_qtys = []
			this.formsProduct.item_desc = []
			this.readOnly.item_ids = []
			this.readOnly.item_qtys = []
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
		checkIfArrayIsUnique(myArray) {
			return myArray.length === new Set(myArray).size;
		},
		checkDialogValid(){
			if(this.formsType !== 'edit'){
				let data = this.formsProduct.product_ids
				if(this.checkIfArrayIsUnique(data) !== false){
					this.messageErrorProduct = ''
					this.dialogProduk = false
				}else{
					this.messageErrorProduct = 'Produk yang anda masukkan sudah ada di list'
				}
			}else{
				let data = this.formsProduct.product_ids_edit
				if(this.checkIfArrayIsUnique(data) !== false){
					this.messageErrorProduct = ''
					this.dialogProduk = false
				}else{
					this.messageErrorProduct = 'Produk yang anda masukkan sudah ada di list'
				}
			}
		},
        removeProductInput(index){
			this.formsProduct.item_ids.splice(index, 1)
			this.formsProduct.item_qtys.splice(index, 1)
			this.formsProduct.item_desc.splice(index, 1)
			this.readOnly.item_ids.splice(index, 1)
			this.readOnly.item_qtys.splice(index, 1)
        },
        formatDate(val){
            return this.$FUNCTIONS.formatDate(val)
        },
        formatTime(val){
            return this.$FUNCTIONS.formatTimeUTC(val)
		},
		searchArray(nameKey, myArray){
            for (var i=0; i < myArray.length; i++) {
                if (myArray[i].id === nameKey) {
                    return myArray[i];
                }
            }
		},
		ChangeChasisNumber(val){
			if(this.formsType !== 'edit'){
				let data = this.formsProduct.product_ids[val]
				let datasValue = this.searchArray(data, this.itemsProductItems)
				if(datasValue !== undefined){
					this.productItemsDetails.chasis_number[val] = datasValue.chassis_number
					this.productItemsDetails.machine_number[val] = datasValue.machine_number
					this.productItemsDetails.code[val] = datasValue.code
					this.productItemsDetails.name[val] = datasValue.name
					if(datasValue.product){
						this.productItemsDetails.product[val] = datasValue.product.name
					}
					if(datasValue.colour){
						this.productItemsDetails.colour[val] = datasValue.colour.name
					}
				}
			}else{
				let data = this.formsProduct.product_ids_edit[val]
				let datasValue = this.searchArray(data, this.itemsProductItems)
				if(datasValue !== undefined){
					this.productItemsDetailsEdits.chasis_number[val] = datasValue.chassis_number
					this.productItemsDetailsEdits.machine_number[val] = datasValue.machine_number
					this.productItemsDetailsEdits.code[val] = datasValue.code
					this.productItemsDetailsEdits.name[val] = datasValue.name
					if(datasValue.product){
						this.productItemsDetailsEdits.product[val] = datasValue.product.name
					}
					if(datasValue.colour){
						this.productItemsDetailsEdits.colour[val] = datasValue.colour.name
					}
				}
			}
		},
		wareHouseItemChange(val){
			this.getPostItemProduk(val, '')
			this.formsProduct.item_ids = []
			this.formsProduct.item_qtys = []
			this.formsProduct.item_desc = []
			this.readOnly.item_ids = []
			this.readOnly.item_qtys = []
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
						this.itemsDetailExcel = response.data.data

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
							var datas = XLSX.utils.table_to_sheet(document.getElementById('table-export-delivery-order'))
							datas['!cols'] = wscols;
							var wb = XLSX.utils.book_new()
							let filename = "delivery-order-jarvis"
							XLSX.utils.book_append_sheet(wb, datas, 'Pindah Gudang')
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
		}
    }
}
</script>
<style lang="scss" scoped>
.choose-button, .input-button{
	display: inline-block;
	color: #FFFFFF;
	background: #800080;
	border: 1px solid #800080;
	padding: 5px 7px;
	border-radius: 5px;
	font-size: 12px;
}
.note{
    color: #800080;
    font-size: 12px;
    font-weight: 600;
    display: block;
    margin-top: 10px;
}
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
