<template>
    <div class="content-wrapper">
        <div id="claim">
            <div class="page-header">
                <page-header titleName="Register Garansi" :isCreate="false"></page-header>
            </div>
            <div class="content">
                <div class="filterSearching clearfix">
                    <div class="input-with-icons with-dropdowns clearfix">
                        <el-input v-model="searchQuery" class="float-left">
							<el-select style="margin-left:0;" v-model="searchKey" slot="prepend" placeholder="Search by">
                                <el-option label="Nama" value="search"></el-option>
                                <el-option label="Phone" value="phone"></el-option>
                            </el-select>
						</el-input>
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
					<el-select
						v-model="searchItem"
						filterable
						placeholder="Pilih Nomor Rangka"
						style="margin-left: 0;">
						<el-option value="" label="Pilih Nomor Rangka">Semua Nomor Rangka</el-option>
						<el-option
							v-for="(dataItem, indexItem) in itemsDataProductItem"
							:key="indexItem"
							:value="dataItem.id"
							:label="dataItem.chassis_number">
							{{dataItem.chassis_number}}
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
						<!-- <el-tab-pane label="Semua Status" name=" "></el-tab-pane> -->
						<el-tab-pane label="Pending" name="pending"></el-tab-pane>
						<el-tab-pane label="Accept" name="accept"></el-tab-pane>
						<el-tab-pane label="Reject" name="reject"></el-tab-pane>
					</el-tabs>
				</div>
                <el-table
                    :data="itemsData"
                    max-height="530"
                    empty-text="No data available in table"
                    ref="singleTable"
                    v-loading="loading"
                    class="mobayar-table">
                    <el-table-column prop="fullname" label="Nama" width="150"></el-table-column>
                    <el-table-column prop="phone" label="Phone" width="120"></el-table-column>
                    <el-table-column label="Nomor Identitas" width="150">
                        <template slot-scope="scope">
                            <div v-if="scope.row.identity_number">{{scope.row.identity_number}}</div>
                            <div v-else>-</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="Items" width="200">
                        <template slot-scope="scope">
                            <div v-if="scope.row.item">
                                <b>Kode:</b> {{scope.row.item.code}}<br>
                                <b>Nama:</b> {{scope.row.item.name}}<br>
                                <b>No. Rangka:</b> {{scope.row.item.chassis_number}}<br>
                                <b>No. Mesin:</b> {{scope.row.item.machine_number}}
                            </div>
                            <div v-else>-</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="Status" align="center">
                        <template slot-scope="scope">
                            <span class="badge inline success" v-if="scope.row.status == 'accept'">{{scope.row.status}}</span>
                            <span class="badge inline failed" v-else-if="scope.row.status == 'reject'">{{scope.row.status}}</span>
                            <span class="badge inline pending" v-else-if="scope.row.status == 'pending'">{{scope.row.status}}</span>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="Last Update" width="100">
                        <template slot-scope="scope">
                            {{scope.row.updated_at | moment("YYYY-MM-DD, H:mm:ss")}}
                        </template>
                    </el-table-column>
					<el-table-column label="Created At" width="100">
                        <template slot-scope="scope">
                            {{scope.row.created_at | moment("YYYY-MM-DD, H:mm:ss")}}
                        </template>
                    </el-table-column>
                    <el-table-column label="Actions">
                        <template slot-scope="scope">
                            <a href="#" @click.prevent="handleCurrentChange(scope.row)">
                                <el-tooltip class="item" style="margin-right: 10px;" effect="dark" content="Detail Klaim" placement="top">
                                    <font-awesome-icon class="fontIcons" :icon="fontsIcons.info" />
                                </el-tooltip>
                            </a>
                            <a href="#" @click.prevent="deleteFunction(scope.row.id)">
                                <el-tooltip class="item" effect="dark" content="Hapus Klaim Garansi" placement="top">
                                    <font-awesome-icon class="fontIcons" :icon="fontsIcons.delete" />
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
            </div>
        </div>
    </div>
</template>

<script>
import {
    faTrash,
    faInfoCircle
} from '@fortawesome/free-solid-svg-icons'
import pageHeader from '@/components/pageHeader'
import loadingSvg from '@/components/loadingSvg'

let date = new Date()
let firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

export default {
    name: 'claim',
    components: { pageHeader, loadingSvg },
    data(){
        return{
			sectionApi: 'claim',
			sectionApiItem: "item",
            loading: false,
            loadingForm: false,
			itemsData: [],
			itemsDataProductItem: [],
            itemDataDetail: [],
            totalPage: '',
            limit: 10,
            page: 1,
			filterQuery: "pending",
			dateRange: [this.$FUNCTIONS.formatDate(firstDay), this.$FUNCTIONS.formatDate(lastDay)],
			format: 'yyyy-MM-dd',
			searchQuery: "",
			searchKey: "search",
			searchQueryPhone: "",
			searchItem: "",
            titleForms: '',
            formsType: '',
            messagesuccess: '',
            messageerror: '',
            confirmDescDelete: "Anda yakin akan menghapus data Klaim Garansi dari daftar?",
            confirmTitleDelete: "Hapus Klaim Garansi",
            textDataDeleteSuccess: "1 Items Berhasil dihapus.",
            fontsIcons:{
                delete: faTrash,
                info: faInfoCircle
            },
        }
    },
    created(){
        this.$FUNCTIONS.checkPermissions(this.$dataRole['.cms.claim.get'])
    },
    mounted(){
		this.getPost()
		this.getPostItemProduct()
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
		dateRange: function(){
			this.getPost()
            this.$FUNCTIONS.checkPaginations()
		},
		searchQueryPhone: function(){
			this.getPost()
            this.$FUNCTIONS.checkPaginations()
		},
		searchItem: function(){
			this.getPost()
            this.$FUNCTIONS.checkPaginations()
		},
    },
    methods:{
        buildUrl(value){
            if(value == true){
				if(this.searchKey !== 'phone'){
					return this.$baseUrl + this.sectionApi + "?limit=" + this.limit + "&page=" + this.page + "&search=" + this.searchQuery + "&order=updated_at&status=" + this.filterQuery + "&start_date=" + this.dateRange[0] + " 00:00:00" + "&end_date=" + this.dateRange[1] + " 23:59:59" + "&item_id=" + this.searchItem
				}else{
					return this.$baseUrl + this.sectionApi + "?limit=" + this.limit + "&page=" + this.page + "&order=updated_at&status=" + this.filterQuery + "&start_date=" + this.dateRange[0] + " 00:00:00" + "&end_date=" + this.dateRange[1] + " 23:59:59" + "&phone=" + this.searchQuery + "&item_id=" + this.searchItem
				}
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
		async getPostItemProduct(){
			try{
				let url = this.$baseUrl + this.sectionApiItem + "?limit=10000&page=1&type=bike"
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
        async deletePost(url){
            try{
                const response = await this.$services.deleteList(url)
                if(response.status == 200) {
                    this.messagesuccess = this.textDataDeleteSuccess
                    this.getPost()
                }else{
                    this.$FUNCTIONS.notify('error', 'Error', this.$textErrorDelete)
                }
            }catch(err){
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
        },
        deleteFunction(id) {
            this.$confirm(this.confirmDescDelete, this.confirmTitleDelete, {
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                type: "warning"
            }).then(() => {
                let url = this.buildUrl(false) + "/" + id
                this.deletePost(url)
            });
        },
        getResult: _.debounce(function(){
            this.getPost()
        }, 500),
        handleCurrentChange(val){
            if(val){
                this.titleForms = this.dataTextUpdate
                this.formsType = 'edit'
                this.$router.push({ name: 'claim-detail', params: { id: val.id }})
            }
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
        closeModal(row){
            this.$FUNCTIONS.sidebarToggle(false)
            this.$refs.singleTable.setCurrentRow(row)
            this.$refs.formsvalid.resetFields()
        }
    }
}
</script>
