<template>
    <div class="content-wrapper">
        <div id="product-colour">
			<div class="page-header" style="margin-bottom: 0;">
                <div class="page-header-content clearfix">
					<router-link v-bind:to="'/credit-submission'" class="back-button">
						<i class="icon icon-caret-left"></i> Back to List
					</router-link>
                </div>
			</div>
            <page-header
				titleName="Credit Submission Detail"
				:isCreate="false"></page-header>
            <div class="content">
				<el-row :gutter="20" style="position:relative;">
					<loading-svg :isLoading="loading"></loading-svg>
					<el-col :span="24">
						<div class="bg-white">
							<div class="list-items">
								<h4 class="title">Info Detail</h4>
								<el-row :gutter="20">
									<el-col :span="6" :xs="24" class="item-general-info">
										<h5>Number</h5>
										<check-empty :value="itemsData.number"></check-empty>
									</el-col>
									<el-col :span="6" :xs="24" class="item-general-info">
										<h5>Customer Fullname</h5>
										<check-empty :value="itemsData.customer_fullname"></check-empty>
									</el-col>
									<el-col :span="6" :xs="24" class="item-general-info">
										<h5>Customer Email</h5>
										<check-empty :value="itemsData.customer_email"></check-empty>
									</el-col>
									<el-col :span="6" :xs="24" class="item-general-info">
										<h5>Customer Phone Number</h5>
										<check-empty :value="itemsData.customer_phone_number"></check-empty>
									</el-col>
									<el-col :span="6" :xs="24" class="item-general-info">
										<h5>Customer Address</h5>
										<check-empty :value="itemsData.customer_address"></check-empty>
									</el-col>
									<el-col :span="6" :xs="24" class="item-general-info">
										<h5>Customer Bill Address</h5>
										<check-empty :value="itemsData.customer_bill_address"></check-empty>
									</el-col>
									<el-col :span="6" :xs="24" class="item-general-info">
										<h5>Seller Contact</h5>
										<check-empty :value="itemsData.seller_contact"></check-empty>
									</el-col>
									<el-col :span="6" :xs="24" class="item-general-info">
										<h5>Status</h5>
										<check-empty :value="itemsData.status"></check-empty>
									</el-col>
									<el-col :span="6" :xs="24" class="item-general-info">
										<h5>Interest</h5>
										<check-empty :value="itemsData.interest"></check-empty>
									</el-col>
									<el-col :span="6" :xs="24" class="item-general-info">
										<h5>Installment Fee</h5>
										<prices-value :value="itemsData.installment_fee" currency="Rp."></prices-value>
									</el-col>
									<el-col :span="6" :xs="24" class="item-general-info">
										<h5>DP</h5>
										<prices-value :value="itemsData.down_payment" currency="Rp."></prices-value>
									</el-col>
									<el-col :span="6" :xs="24" class="item-general-info">
										<h5>Discount </h5>
										<prices-value :value="itemsData.discount" currency="Rp."></prices-value>
									</el-col>
									<el-col :span="6" :xs="24" class="item-general-info">
										<h5>Subtotal </h5>
										<prices-value :value="itemsData.subtotal" currency="Rp."></prices-value>
									</el-col>
									<el-col :span="6" :xs="24" class="item-general-info">
										<h5>Total </h5>
										<prices-value :value="itemsData.total" currency="Rp."></prices-value>
									</el-col>
									<el-col :span="12" :xs="24" class="item-general-info">
										<h5>Notes </h5>
										<check-empty :value="itemsData.notes"></check-empty>
									</el-col>
								</el-row>
							</div>
							<div class="list-items" v-if="itemsData.provider">
								<h4 class="title">Info Provider</h4>
								<el-row :gutter="20">
									<el-col :span="6" :xs="24" class="item-general-info">
										<h5>Name</h5>
										<check-empty :value="itemsData.provider.name"></check-empty>
									</el-col>
									<el-col :span="6" :xs="24" class="item-general-info">
										<h5>Interest Type</h5>
										<check-empty :value="itemsData.provider.interest_type"></check-empty>
									</el-col>
									<el-col :span="6" :xs="24" class="item-general-info">
										<h5>Interest Rate</h5>
										<check-empty :value="itemsData.provider.interest_rate"></check-empty>
									</el-col>
									<el-col :span="6" :xs="24" class="item-general-info">
										<h5>DP Type</h5>
										<check-empty :value="itemsData.provider.dp_type"></check-empty>
									</el-col>
									<el-col :span="6" :xs="24" class="item-general-info">
										<h5>DP Rate</h5>
										<check-empty :value="itemsData.provider.dp_rate"></check-empty>
									</el-col>
									<el-col :span="6" :xs="24" class="item-general-info">
										<h5>Status</h5>
										<check-empty :value="itemsData.provider.status"></check-empty>
									</el-col>
									<el-col :span="6" :xs="24" class="item-general-info">
										<h5>Logo</h5>
										<img style="max-height: 50px;" :src="itemsData.provider.logo_url">
									</el-col>
								</el-row>
							</div>
							<div class="list-items" v-if="itemsData.items">
								<h4 class="title">Info Items</h4>
								<el-table
									:data="itemsData.items"
									max-height="530"
									empty-text="No data available in table"
									ref="singleTable"
									v-loading="loading"
									style="margin-top: 25px;"
									class="mobayar-table">
										<el-table-column label="Product">
											<template slot-scope="scope">
												<div v-if="scope.row.product">
													{{scope.row.product.name}}
												</div>
											</template>
										</el-table-column>
										<el-table-column label="Price">
											<template slot-scope="scope">
												<prices-value :value="scope.row.price" currency="Rp."></prices-value>
											</template>
										</el-table-column>
										<el-table-column label="Qty" prop="quantity"></el-table-column>
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
							</div>
						</div>
					</el-col>
				</el-row>
				<!-- <pre>{{itemsData}}</pre> -->
            </div>
        </div>
    </div>
</template>

<script>
import checkEmpty from '@/components/checkEmpty'
import pricesValue from '@/components/pricesValue'
import pageHeader from '@/components/pageHeader'
import loadingSvg from '@/components/loadingSvg'

export default {
    name: 'credit-submission-detail',
    components: { pageHeader, loadingSvg, checkEmpty, pricesValue },
    data(){
        return{
			sectionApi: "creditSubmission",
			idData: this.$route.params.id,
            loading: false,
            itemsData: []
        }
    },
    created(){
        this.$FUNCTIONS.checkPermissions(this.$dataRole['.cms.creditsubmission.*.get'])
    },
    mounted(){
        this.getPost()
    },
    watch: {
        searchQuery: function(){
            this.getResult()
            this.$FUNCTIONS.checkPaginations()
        }
    },
    methods:{
        buildUrl(){
            return this.$baseUrl + this.sectionApi + "/" + this.idData
        },
        async getPost(){
            try{
                this.loading = true
                const response = await this.$services.getList(this.buildUrl())
                this.loading = false
                if(response.status == 200){
                    this.itemsData = response.data
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.box-info-detail{
    background: #fff;
    position: relative;
    border: none;
    box-shadow: 0px 1px 3px #DFE4E8;
    h4{
        color: #39434e;
        margin:20px 10px 5px;
    }
}
.list-items{
	margin-top: 25px;
	border-top: 1px solid #ddd;
	padding-top: 25px;
	&:first-child{
		margin-top: 0;
		border-top: none;
		padding-top: 0;
	}
}
.bg-white{
    background: #fff;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0px 1px 3px #DFE4E8;
	.title{
		margin-bottom: 0;
	}
}
.item-general-info{
	margin-top: 25px;
	h5{
		margin-bottom: 5px;
	}
}
</style>
