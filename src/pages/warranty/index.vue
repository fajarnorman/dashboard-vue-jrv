<template>
    <div class="content-wrapper">
        <div id="product-brand">
            <page-header titleName="List Garansi" :isCreate="false"></page-header>
            <div class="content">
                <div class="filterSearching clearfix">
                    <div class="input-with-icons clearfix" style="margin-right: 0;">
                        <el-input v-model="searchQuery" class="float-left"></el-input>
                        <img :src="require('@/assets/images/icons/search1.png')">
                    </div>
					<el-select
						v-model="searchItem"
						filterable
						placeholder="Pilih Nomor Rangka">
						<el-option value="" label="Pilih Nomor Rangka">Semua Nomor Rangka</el-option>
						<el-option
							v-for="(dataItem, indexItem) in itemsDataProductItem"
							:key="indexItem"
							:value="dataItem.id"
							:label="dataItem.chassis_number">
							{{dataItem.chassis_number}}
						</el-option>
					</el-select>
					<el-select
						v-model="searchStore"
						filterable
						placeholder="Pilih Toko">
						<el-option value="" label="Pilih Toko">Semua Toko</el-option>
						<el-option
							v-for="(dataItem, indexItem) in itemsDataStore"
							:key="indexItem"
							:value="dataItem.id"
							:label="dataItem.name">
							{{dataItem.name}}
						</el-option>
					</el-select>
                </div>
                <el-alert
                    v-if="messagesuccess"
                    title=""
                    type="success"
                    :description="messagesuccess"
                    show-icon></el-alert>
				<div class="filterstatus">
					<el-tabs v-model="filterQuery">
						<el-tab-pane label="Active" name="active"></el-tab-pane>
						<el-tab-pane label="Expired" name="expired"></el-tab-pane>
					</el-tabs>
				</div>
                <el-table
                    :data="itemsData"
                    max-height="530"
                    empty-text="No data available in table"
                    ref="singleTable"
                    v-loading="loading"
                    class="mobayar-table">
                    <el-table-column label="Nama" prop="fullname"></el-table-column>
                    <el-table-column label="Phone" prop="phone"></el-table-column>
                    <el-table-column label="Alamat" prop="address"></el-table-column>
                    <el-table-column label="Item" width="250">
                        <template slot-scope="scope">
                            <div v-if="scope.row.item">
								<b>Kode: </b> {{scope.row.item.code}}<br>
                                <b>Nama: </b> {{scope.row.item.name}}<br>
                                <b>Nomor Rangka: </b> {{scope.row.item.chassis_number}}<br>
								<b>Nomor Mesin: </b> {{scope.row.item.machine_number}}
                            </div>
                        </template>
                    </el-table-column>
					<el-table-column label="Tanggal Pembelian" width="140">
						<template slot-scope="scope">
							{{scope.row.purchase_date | moment("YYYY-MM-DD")}}
						</template>
					</el-table-column>
                    <el-table-column label="Garansi Expired">
                        <template slot-scope="scope">
                            {{scope.row.warranty_expired_date | moment("YYYY-MM-DD")}}
                        </template>
                    </el-table-column>
                    <el-table-column label="Actions" width="100">
                        <template slot-scope="scope">
                            <a href="#" @click.prevent="handleCurrentChange(scope.row)">
                                <el-tooltip class="item" style="margin-right: 10px;" effect="dark" content="Detail Garansi" placement="top">
                                    <font-awesome-icon class="fontIcons" :icon="fontsIcons.info" />
                                </el-tooltip>
                            </a>
                            <a href="#" @click.prevent="$router.push({ name: 'history-warranty', params: { id: scope.row.id }})">
                                <el-tooltip class="item" effect="dark" content="History Garansi" placement="top">
                                    <font-awesome-icon class="fontIcons" :icon="fontsIcons.history" />
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
                            <el-form :model="forms" status-icon ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                <div class="item-forms-details">
                                    <h5>Info</h5>
                                    <div class="forms-details">
                                        <!-- <pre>{{itemDataDetail}}</pre> -->
                                        <el-row :gutter="20">
                                            <el-col :span="24">
                                                <el-form-item label="Name">
                                                    <div class="lineHeightNormal">{{itemDataDetail.fullname}}</div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Phone">
                                                    <div class="lineHeightNormal">{{itemDataDetail.phone}}</div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Type">
                                                    <div class="lineHeightNormal">
														<span v-if="itemDataDetail.type !== ''">{{itemDataDetail.type}}</span>
														<span v-else>-</span>
													</div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Tanggal Pembelian">
                                                    <div class="lineHeightNormal">{{itemDataDetail.purchase_date | moment("YYYY-MM-DD")}}</div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Garansi Expired">
                                                    <div class="lineHeightNormal">{{itemDataDetail.warranty_expired_date | moment("YYYY-MM-DD")}}</div>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="24">
                                                <el-form-item label="Alamat">
                                                    <div class="lineHeightNormal">{{itemDataDetail.address}}</div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
												<el-form-item label="Invoice/Struk Pembelian">
													<a href="#" @click.prevent="openImage(itemDataDetail.invoice_pic_url)">
                                                    	<img class="images-details" :src="itemDataDetail.invoice_pic_url">
													</a>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
												<el-form-item label="Kartu Garansi">
													<a href="#" @click.prevent="openImage(itemDataDetail.warranty_card_pic_url)">
                                                    	<img class="images-details" :src="itemDataDetail.warranty_card_pic_url">
													</a>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                                <div class="item-forms-details" v-if="itemDataDetail.item">
                                    <h5>Info Items</h5>
                                    <div class="forms-details">
                                        <el-row :gutter="20">
                                            <el-col :span="12">
                                                <el-form-item label="Name Item">
                                                    <div class="lineHeightNormal">{{itemDataDetail.item.name}}</div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Chasis Number">
                                                    <div class="lineHeightNormal">{{itemDataDetail.item.chassis_number}}</div>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                                <div class="item-forms-details" v-if="itemDataDetail.store">
                                    <h5>Info Toko</h5>
                                    <div class="forms-details">
                                        <el-row :gutter="20">
                                            <el-col :span="12">
                                                <el-form-item label="Name Toko">
                                                    <div class="lineHeightNormal">{{itemDataDetail.store.name}}</div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Phone">
                                                    <div class="lineHeightNormal">{{itemDataDetail.store.phone}}</div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Alamat">
                                                    <div class="lineHeightNormal">
                                                        {{itemDataDetail.store.address}}<br>
                                                        <a target="_blank" :href="'https://maps.google.com/?ll='+itemDataDetail.store.latitude+','+itemDataDetail.store.longitude">Buka di Google Maps</a>
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                            </el-form>
                        </section>
                    </div>
                    <div class="actions-button clearfix">
                        <el-button class="button-outline-black" @click="closeModal()">Batal</el-button>
                    </div>
                </div>
            </div>
			<el-dialog title=""
                class="imageOpenModal"
                top="5vh"
                :visible.sync="imageOpen"
				width="90%">
                <div class="img-container" style="height: 700px;">
                    <img :src="imageValue" class="img-center images-must-rotate">
                </div>
                <div class="bottom-actions-modal">
                    <el-button class="button-white-green button-rotate" @click.prevent="rotateImages" round>
                        Rotate
                        <font-awesome-icon class="fontIcons" :icon="fontsIcons.rotate"/>
                    </el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import JQuery from 'jquery'
import {
    faHistory,
	faInfoCircle,
	faSync
} from '@fortawesome/free-solid-svg-icons'
import pageHeader from '@/components/pageHeader'
import loadingSvg from '@/components/loadingSvg'

export default {
    name: 'warranty',
    components: { pageHeader, loadingSvg },
    data(){
        return{
			sectionApi: "warranty",
			sectionApiItem: "item",
			sectionApiStore: "store",
            limit: 10,
            page: 1,
            loading: false,
			loadingForm: false,
			loadingItem: false,
			loadingStore: false,
			itemsData: [],
			itemsDataProductItem: [],
			itemsDataStore: [],
            itemDataDetail: [],
			totalPage: 0,
			searchItem: "",
			searchStore: "",
			searchPhone: "",
			searchQuery: "",
			filterQuery: "active",
            titleForms: "",
            formsType: "",
            messagesuccess: "",
            messageerror: "",
            fontsIcons:{
                history: faHistory,
				info: faInfoCircle,
				rotate: faSync,
            },
            forms: {
                name: "",
            },
            dataTextCreate: "Buat Detail",
            dataTextUpdate: "Detail Garansi",
            confirmDescDelete: "Anda yakin akan menghapus data Detail dari daftar?",
            confirmTitleDelete: "Hapus Detail",
            textDataCreateSuccess: "Data Detail Berhasil ditambahkan.",
            textDataUpdateSuccess: "Data Detail Berhasil diupdate.",
			textDataDeleteSuccess: "1 Items Berhasil dihapus.",
			imageValue: '',
			imageOpen: false,
			rotateNumber: 0,
        }
    },
    created(){
        this.$FUNCTIONS.checkPermissions(this.$dataRole['.cms.warranty.get'])
    },
    mounted(){
		this.getPost()
		this.getPostCategories('item')
		this.getPostCategories('store')
    },
    watch: {
        searchQuery: function(){
            this.getResult()
            this.$FUNCTIONS.checkPaginations()
		},
		searchItem: function(){
            this.getPost()
            this.$FUNCTIONS.checkPaginations()
		},
		searchStore: function(){
            this.getPost()
            this.$FUNCTIONS.checkPaginations()
		},
		filterQuery: function(){
            this.getPost()
            this.$FUNCTIONS.checkPaginations()
		},
		imageOpen(newValue) {
			if(newValue == false){
				let that = this
				setTimeout(function(){
					that.rotateNumber = 0
					JQuery('.images-must-rotate').css('transform', 'rotate(0deg)')
				}, 500)
			}
		},
    },
    methods:{
        buildUrl(value){
            if(value == true){
                return this.$baseUrl + this.sectionApi + "?limit=" + this.limit + "&page=" + this.page + "&search=" + this.searchQuery + "&item_id=" + this.searchItem + "&store_id=" + this.searchStore + "&phone=" + this.searchPhone + "&status=" + this.filterQuery
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
		async getPostCategories(value){
			if(value == 'item'){
				try{
					let url = this.$baseUrl + this.sectionApiItem + "?limit=10000&page=1&type=bike"
                	this.loadingItem = true
					const response = await this.$services.getList(url)
					this.loadingItem = false
					if(response.status == 200){
						this.itemsDataProductItem = response.data.data
					}else{
						this.$FUNCTIONS.checkErrorResponse(response.status)
					}
				}catch(err){
					this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
				}
			}else{
				try{
					let url = this.$baseUrl + this.sectionApiStore + "?limit=10000&page=1"
                	this.loadingStore = true
					const response = await this.$services.getList(url)
					this.loadingStore = false
					if(response.status == 200){
						this.itemsDataStore = response.data.data
					}else{
						this.$FUNCTIONS.checkErrorResponse(response.status)
					}
				}catch(err){
					this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
				}
			}
        },
        async postFunction(url) {
            try{
                this.loadingForm = true
                const response = await this.$services.getList(url)
                this.loadingForm = false
                if(response.status == 200){
                    this.itemDataDetail = response.data.data
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
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
                this.titleForms = this.dataTextUpdate
                this.formsType = "edit"
                this.itemDataDetail = val
                // let url = this.buildUrl(false) + '/' + val.id
                // this.postFunction(url)
                this.$FUNCTIONS.sidebarToggle(true)
            }
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
		},
		rotateImages(){
			this.rotateNumber += 90
			JQuery('.images-must-rotate').css('transform', 'rotate('+this.rotateNumber+'deg)')
		},
		openImage(value){
			this.imageValue = value
			this.imageOpen = true
		}
    }
}
</script>
<style lang="scss">
.images-details{
    width: auto;
    max-width: 100%;
    border-radius: 5px;
}
</style>
