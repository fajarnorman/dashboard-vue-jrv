<template>
    <div class="content-wrapper">
        <div id="product-item">
            <page-header titleName="Daftar Item" :isCreate="true"></page-header>
            <div class="content">
                <div class="filterSearching clearfix">
                    <!-- <div class="input-with-icons clearfix">
                        <el-input v-model="searchQuery" class="float-left"></el-input>
                        <img :src="require('@/assets/images/icons/search1.png')">
                    </div> -->
                    <div class="input-with-icons with-dropdowns clearfix">
                        <el-input v-model="searchQuery" class="float-left" :disabled="searchKey == '' ? true : false">
                            <el-select style="margin-left:0;" v-model="searchKey" slot="prepend" placeholder="Search by">
                                <el-option label="Nama" value="search"></el-option>
                                <el-option label="Kode" value="code"></el-option>
                                <el-option label="No. Rangka" value="chassis_number"></el-option>
                                <el-option label="No. Mesin" value="machine_number"></el-option>
								<el-option label="Qr Code" value="qrcode_serial_number"></el-option>
                            </el-select>
                        </el-input>
                        <img :src="require('@/assets/images/icons/search1.png')">
                    </div>
					<el-button class="button-outline-green float-right" @click.prevent="getExcel" round>
						<img :src="require('@/assets/images/icons/download-new.png')" v-if="(loadingExcel == false)">
						<div class="lds-ring" v-else><div></div><div></div><div></div><div></div></div> Export
					</el-button>
					<div style="margin-left: 0;float:left;margin-top: 15px;">
						<el-select style="margin-left: 0;" v-model="wareseHouseFilter" placeholder="Pilih Warehouse">
							<el-option value="" label="Semua Warehouse"></el-option>
							<el-option
								v-for="(dataWarehouse, indexWarehouse) in itemsDataWarehouse"
								:key="'ware-'+indexWarehouse"
								:value="dataWarehouse.id"
								:label="dataWarehouse.name"></el-option>
						</el-select>
						<el-select v-model="typeFilter" placeholder="Pilih Tipe">
							<el-option value="" label="Semua Tipe"></el-option>
							<el-option value="bike" label="Bike"></el-option>
							<el-option value="sparepart" label="Sparepart"></el-option>
						</el-select>
						<el-select
							v-model="productFilter"
							placeholder="Pilih Produk">
							<el-option value="" label="Semua Produk"></el-option>
							<el-option
								v-for="(data, index) in itemsDataProduct"
								:key="index"
								:value="data.id"
								:label="data.name"></el-option>
						</el-select>
					</div>
                </div>
                <el-alert
                    v-if="messagesuccess"
                    title=""
                    type="success"
                    :description="messagesuccess"
                    show-icon></el-alert>
                <div class="filterstatus">
					<el-tabs v-model="filterQuery">
						<el-tab-pane label="Semua Status" name=" "></el-tab-pane>
						<el-tab-pane label="Warehouse" name="warehouse"></el-tab-pane>
						<el-tab-pane label="Toko" name="store"></el-tab-pane>
						<el-tab-pane label="User" name="user"></el-tab-pane>
					</el-tabs>
				</div>
                <el-table
                    :data="itemsData"
                    max-height="530"
                    empty-text="No data available in table"
                    ref="singleTable"
                    v-loading="loading"
                    class="mobayar-table">
                    <el-table-column width="200" label="Item">
						<template slot-scope="scope">
							<div>
								<b>Kode: </b>
								<span v-if="scope.row.code !== null">{{scope.row.code}}</span>
								<span v-else>-</span>
							</div>
							<div>
								<b>Nama: </b>
								<span v-if="scope.row.name !== null">{{scope.row.name}}</span>
								<span v-else>-</span>
							</div>
							<div>
								<b>Produk: </b>
								<span v-if="scope.row.product">{{scope.row.product.name}}</span>
								<span v-else>-</span>
							</div>
							<div>
								<b>Warna: </b>
								<span v-if="scope.row.colour">{{scope.row.colour.name}}</span>
								<span v-else>-</span>
							</div>
							<div>
								<b>QRCode: </b>
								<span v-if="scope.row.qrcode_serial_number">{{scope.row.qrcode_serial_number}}</span>
								<span v-else>-</span>
							</div>
						</template>
					</el-table-column>
                    <el-table-column label="Toko" width="110">
                        <template slot-scope="scope">
                            <div v-if="scope.row.store">
                                {{scope.row.store.name}}
                            </div>
							<div v-else>-</div>
                        </template>
                    </el-table-column>
                    <el-table-column width="120" label="Nomor Rangka" prop="chassis_number">
						<template slot-scope="scope">
							<div v-if="scope.row.chassis_number !== null">{{scope.row.chassis_number}}</div>
							<div v-else>-</div>
						</template>
					</el-table-column>
					<el-table-column label="Qty" prop="qty" width="45">
						<template slot-scope="scope">
							<div v-if="scope.row.qty !== null">{{scope.row.qty}}</div>
							<div v-else>-</div>
						</template>
					</el-table-column>
					<el-table-column label="Tipe" width="70" prop="type">
						<template slot-scope="scope">
							<div v-if="scope.row.type !== null">{{scope.row.type}}</div>
							<div v-else>-</div>
						</template>
					</el-table-column>
					<el-table-column label="Warehouse" prop="type">
						<template slot-scope="scope">
							<div v-if="scope.row.warehouse">
								<div v-if="scope.row.warehouse.length !== 0">{{scope.row.warehouse.name}}</div>
								<div v-else>-</div>
							</div>
							<div v-else>-</div>
						</template>
					</el-table-column>
					<el-table-column label="Ditempatkan" prop="placed">
						<template slot-scope="scope">
							<div v-if="scope.row.placed !== null">{{scope.row.placed}}</div>
							<div v-else>-</div>
						</template>
					</el-table-column>
                    <el-table-column label="Updated At" width="100">
                        <template slot-scope="scope">
                            {{scope.row.updated_at | moment("YYYY-MM-DD, H:mm:ss")}}
                        </template>
                    </el-table-column>
                    <el-table-column label="Created At" width="100">
                        <template slot-scope="scope">
                            {{scope.row.created_at | moment("YYYY-MM-DD, H:mm:ss")}}
                        </template>
                    </el-table-column>
					<el-table-column label="Actions" width="80">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" content="Detail Histori Item" placement="top">
								<a href="#" @click.prevent="detailHistory(scope.row.id)" style="margin-right: 10px;">
									<font-awesome-icon class="fontIcons" :icon="fontsIcons.detail" />
								</a>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="Edit Item" placement="top">
								<a href="#" @click.prevent="handleCurrentChange(scope.row)">
									<font-awesome-icon class="fontIcons" :icon="fontsIcons.edit" />
								</a>
							</el-tooltip>
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
                                                <el-form-item label="Kode" prop="code">
                                                    <el-input v-model="forms.code"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Nama" prop="name">
                                                    <el-input v-model="forms.name"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Toko" prop="store_id">
                                                    <el-select
														v-model="forms.store_id"
														:loading="loadingStore"
														placeholder="Pilih Toko"
														:popper-append-to-body="false"
														class="custom-select-width">
                                                        <el-option
                                                            v-for="itemStore in itemsDataStore"
                                                            :key="itemStore.id"
                                                            :label="itemStore.name"
                                                            :value="itemStore.id">
                                                            <b>{{itemStore.name}}</b><br>
                                                            {{itemStore.address}}
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Nomor Rangka" prop="chassis_number">
                                                    <el-input v-model="forms.chassis_number"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Nomor Mesin" prop="machine_number">
                                                    <el-input v-model="forms.machine_number"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Produk" prop="product_id">
                                                    <el-select v-model="forms.product_id" :loading="loadingProduct" placeholder="Pilih Produk">
                                                        <el-option
                                                            v-for="itemProduk in itemsDataProduct"
                                                            :key="itemProduk.id"
                                                            :label="itemProduk.name"
                                                            :value="itemProduk.id"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Warna" prop="colour_id">
                                                    <el-select v-model="forms.colour_id" :loading="loadingColour" placeholder="Pilih Warna">
                                                        <el-option
                                                            v-for="itemColor in itemsDataColour"
                                                            :key="itemColor.id"
                                                            :label="itemColor.name"
                                                            :value="itemColor.id"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Deskripsi">
                                                    <el-input
                                                        type="textarea"
                                                        :rows="5"
                                                        v-model="forms.description"></el-input>
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
				<el-dialog
					title="History Item"
					:visible.sync="modelHistory"
					width="55%"
					top="5vh"
					class="mb-dialog nopadding-right point-modal kepala-regional">
					<div class="content-dialog detail-pencapaian">
						<el-table
							:data="itemDataDetailHistory"
							max-height="530"
							empty-text="No data available in table"
							ref="singleTableHistory"
							v-loading="loadingHistory"
							class="mobayar-table">
							<el-table-column width="250" label="Item">
								<template slot-scope="scope">
									<div v-if="scope.row.item">
										<div>
											<b>Kode: </b>
											<span v-if="scope.row.item.code !== null">{{scope.row.item.code}}</span>
											<span v-else>-</span>
										</div>
										<div>
											<b>Nama: </b>
											<span v-if="scope.row.item.name !== null">{{scope.row.item.name}}</span>
											<span v-else>-</span>
										</div>
										<div>
											<b>N. Rangka : </b>
											<span v-if="scope.row.item.chassis_number !== null">{{scope.row.item.chassis_number}}</span>
											<span v-else>-</span>
										</div>
										<div>
											<b>N. Mesin : </b>
											<span v-if="scope.row.item.machine_number !== null">{{scope.row.item.machine_number}}</span>
											<span v-else>-</span>
										</div>
									</div>
								</template>
							</el-table-column>
							<el-table-column width="70" label="Qty" prop="qty"></el-table-column>
							<el-table-column label="Tipe" prop="type"></el-table-column>
							<el-table-column label="Warehouse">
								<template slot-scope="scope">
									<div v-if="scope.row.warehouse">
										<div v-if="scope.row.warehouse.length !== 0">{{scope.row.warehouse.name}}</div>
										<div v-else>-</div>
									</div>
									<div v-else>-</div>
								</template>
							</el-table-column>
						</el-table>
					</div>
					<span slot="footer" class="dialog-footer">
						<el-button round class="button-white-green" @click.prevent="modelHistory = false" type="primary">Tutup</el-button>
					</span>
				</el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import XLSX from 'xlsx'
import { faInfoCircle, faEdit } from '@fortawesome/free-solid-svg-icons'
import pageHeader from '@/components/pageHeader'
import loadingSvg from '@/components/loadingSvg'

export default {
    name: 'product-item',
    components: { pageHeader, loadingSvg },
    data(){
        return{
            sectionApi: "item",
            sectionApiProduct: "product",
            sectionApiColour: "colour",
			sectionApiStore: "store",
			sectionApiWarehosue: "warehouse",
			sectionApiType: "type",
            limit: 10,
            page: 1,
            filterQuery: " ",
            loading: false,
            loadingForm: false,
            loadingProduct: false,
            loadingColour: false,
			loadingStore: false,
			loadingHistory: false,
			loadingExcel: false,
            itemsData: [],
            itemsDataProduct: [],
            itemsDataColour: [],
			itemsDataStore: [],
			itemsDataWarehouse: [],
			itemsDataType: [],
			itemDataDetail: [],
			itemDataDetailHistory: [],
            totalPage: 0,
			searchQuery: "",
			wareseHouseFilter: "",
			typeFilter: "",
			productFilter: "",
            titleForms: "",
            formsType: "",
            messagesuccess: "",
            messageerror: "",
			searchKey: 'search',
			modelHistory: false,
            forms: {
                code: "",
                name: "",
                store_id: "",
                product_id: "",
                colour_id: "",
                description: "",
                chassis_number: "",
                machine_number: ""
            },
            rules: {
                code: [ { required: true, message: "Inputan Harus diisi", trigger: "blur" } ],
                name: [ { required: true, message: "Inputan Harus diisi", trigger: "blur" } ],
                product_id: [ { required: true, message: "Inputan Harus diisi", trigger: "change" } ],
                colour_id: [ { required: true, message: "Inputan Harus diisi", trigger: "change" } ],
                chassis_number: [ { required: true, message: "Inputan Harus diisi", trigger: "blur" } ],
                machine_number: [ { required: true, message: "Inputan Harus diisi", trigger: "blur" } ]
            },
            dataTextCreate: "Buat Produk Item",
            dataTextUpdate: "Edit Produk Item",
            confirmDescDelete: "Anda yakin akan menghapus data Produk Item dari daftar?",
            confirmTitleDelete: "Hapus Produk Item",
            textDataCreateSuccess: "Data Produk Item Berhasil ditambahkan.",
            textDataUpdateSuccess: "Data Produk Item Berhasil diupdate.",
			textDataDeleteSuccess: "1 Items Berhasil dihapus.",
			fontsIcons: {
				detail: faInfoCircle,
				edit: faEdit
			},
        }
    },
    created(){
        this.$FUNCTIONS.checkPermissions(this.$dataRole['.cms.item.get'])
    },
    mounted(){
        this.getPost()
        this.getPostCategories('product')
        this.getPostCategories('colour')
		this.getPostCategories('store')
		this.getPostWarehouse()
        this.initCreateFunction()
    },
    watch: {
        searchQuery: function(){
            this.getResult()
            this.$FUNCTIONS.checkPaginations()
        },
        filterQuery: function(){
			this.getPost()
            this.$FUNCTIONS.checkPaginations()
		},
		wareseHouseFilter: function(){
			this.getPost()
            this.$FUNCTIONS.checkPaginations()
		},
		typeFilter: function(){
			this.getPost()
            this.$FUNCTIONS.checkPaginations()
		},
		productFilter: function(){
			this.getPost()
            this.$FUNCTIONS.checkPaginations()
		}
    },
    methods:{
        buildUrl(value){
            if(value == true){
				if(this.filterQuery == ' '){
					return this.$baseUrl + this.sectionApi + "?limit=" + this.limit + "&page=" + this.page + "&"+this.searchKey+"=" + this.searchQuery + "&order=updated_at&warehouse_id=" + this.wareseHouseFilter + "&type=" + this.typeFilter + "&product_id=" + this.productFilter
				}else{
					return this.$baseUrl + this.sectionApi + "?limit=" + this.limit + "&page=" + this.page + "&"+this.searchKey+"=" + this.searchQuery + "&status=" + this.filterQuery + "&order=updated_at&warehouse_id=" + this.wareseHouseFilter + "&type=" + this.typeFilter + "&product_id=" + this.productFilter
				}
            }else{
                return this.$baseUrl + this.sectionApi
            }
        },
        buildCategoriesUrl(value){
            if(value == 'product'){
                return this.$baseUrl + this.sectionApiProduct + "?limit=100&page=1"
            }else if(value == 'colour'){
                return this.$baseUrl + this.sectionApiColour + "?limit=100&page=1"
            }else if(value == 'store'){
                return this.$baseUrl + this.sectionApiStore + "?order=name&sort=ASC&limit=100&page=1"
            }
        },
        async getPostCategories(value){
            if(value == 'product'){
                try{
                    this.loadingProduct = true
                    const response = await this.$services.getList(this.buildCategoriesUrl(value))
                    this.loadingProduct = false
                    if(response.status == 200){
                        this.itemsDataProduct = response.data.data
                    }else{
                        this.$FUNCTIONS.checkErrorResponse(response.status)
                    }
                }catch(err){
                    this.loadingProduct = false
                    this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
                }
            }else if(value == 'colour'){
                try{
                    this.loadingColour = true
                    const response = await this.$services.getList(this.buildCategoriesUrl(value))
                    this.loadingColour = false
                    if(response.status == 200){
                        this.itemsDataColour = response.data.data
                    }else{
                        this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
                    }
                }catch(err){
                    this.loadingColour = false
                    this.$FUNCTIONS.notify('error', this.$textNetworkError, err.message)
                }
            }else if(value == 'store'){
                try{
                    this.loadingStore = true
                    const response = await this.$services.getList(this.buildCategoriesUrl(value))
                    this.loadingStore = false
                    if(response.status == 200){
                        this.itemsDataStore = response.data.data
                    }else{
                        this.$FUNCTIONS.checkErrorResponse(response.status)
                    }
                }catch(err){
                    this.loadingStore = false
                    this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
                }
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
			let url = this.$baseUrl + this.sectionApiWarehosue + "?limit=100&page=1"
            try{
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
                        this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
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
                        this.forms.code = this.itemDataDetail.code
                        this.forms.name = this.itemDataDetail.name
                        this.forms.product_id = this.itemDataDetail.product_id
                        this.forms.colour_id = this.itemDataDetail.colour_id
                        this.forms.description = this.itemDataDetail.description
                        this.forms.chassis_number = this.itemDataDetail.chassis_number
                        this.forms.machine_number = this.itemDataDetail.machine_number
                        this.forms.store_id = this.itemDataDetail.store_id
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
		async detailHistory(id){
			this.modelHistory = true
			let url = this.buildUrl(false) + '/history/' + id
            try{
				this.loadingHistory = true
				const response = await this.$services.getList(url)
				this.loadingHistory = false
                if(response.status == 200){
                    this.itemDataDetailHistory = response.data.data
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
				this.loadingHistory = false
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
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
                // if(this.$dataRole['.cms.item.*.get']){
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
            this.forms.store_id = ""
            this.forms.product_id = ""
            this.forms.colour_id = ""
            this.forms.description = ""
            this.forms.chassis_number = ""
            this.forms.machine_number = ""
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
							let checkCode = (currentValue.code !== null || currentValue.code !== '') ? currentValue.code : '-'
							let checkName = (currentValue.name !== null || currentValue.name !== '') ? currentValue.name : '-'
							let checkChasisNum = (currentValue.chassis_number !== null || currentValue.chassis_number !== '') ? currentValue.chassis_number : '-'
							let checkMachineNum = (currentValue.machine_number !== null || currentValue.machine_number !== '') ? currentValue.machine_number : '-'
							let checkProduct = (currentValue.product) ? currentValue.product.name : '-'
							let checkColour = (currentValue.colour) ? currentValue.colour.name : '-'
							let checkStore = (currentValue.store) ? currentValue.store.name : '-'
							let checkWarehouse = (currentValue.warehouse) ? currentValue.warehouse.name : '-'
							let checkQrCode = (currentValue.qrcode_serial_number) ? currentValue.qrcode_serial_number : '-'
							let dateUpdatedAt = new Date(currentValue.updated_at)
							let fulldateUpdate = dateUpdatedAt.getFullYear() + '-' + (dateUpdatedAt.getMonth() + 1) + '-' + dateUpdatedAt.getDate() + ' ' + dateUpdatedAt.getHours() + ':' + dateUpdatedAt.getMinutes() + ':' + dateUpdatedAt.getSeconds()
							let dateCreatedAt = new Date(currentValue.created_at)
							let fulldateCreatedAt = dateCreatedAt.getFullYear() + '-' + (dateCreatedAt.getMonth() + 1) + '-' + dateCreatedAt.getDate() + ' ' + dateCreatedAt.getHours() + ':' + dateCreatedAt.getMinutes() + ':' + dateCreatedAt.getSeconds()

							exportToExcel.push(
								{
									'Kode' : checkCode,
									'Nama': checkName,
									'Nomor Rangka' : checkChasisNum,
									'Nomor Mesin' : checkMachineNum,
									'Qr Code' : checkQrCode,
									'Produk': checkProduct,
									'Warna': checkColour,
									'Toko': checkStore,
									'Qty': currentValue.qty,
									'Tipe': currentValue.type,
									'Warehouse': checkWarehouse,
									'Ditempatkan': currentValue.placed,
									'Updated At': fulldateUpdate,
									'Created At': fulldateCreatedAt
								}
							)
                        }, this)

                        let filename = "daftar-item-jarvis"
                        var wscols = [
							{wch:15},
							{wch:20},
							{wch:20},
							{wch:20},
							{wch:20},
							{wch:20},
							{wch:15},
							{wch:20},
							{wch:10},
							{wch:10},
							{wch:20},
							{wch:20},
							{wch:20},
							{wch:20},
							{wch:20},
							{wch:20},
						];

                        var datas = XLSX.utils.json_to_sheet(exportToExcel)
                        datas['!cols'] = wscols;
                        var wb = XLSX.utils.book_new()
                        XLSX.utils.book_append_sheet(wb, datas, 'Daftar Item Jarvis')
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
