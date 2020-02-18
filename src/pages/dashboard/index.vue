<template>
	<div class="content-wrapper">
        <div id="dashboard-charts">
			<div class="page-header">
                <page-header titleName="Dashboard Statistik" :isCreate="false"></page-header>
            </div>
			<div class="content">
				<loading-svg :isLoading="loading"></loading-svg>
				<div class="cards charts-items" v-if="itemsData['analytic']">
					<div class="header-chart clearfix">
						<h4 style="text-transform: capitalize;">Laporan Harian</h4>
					</div>
					<el-row :gutter="20">
						<el-col :span="24">
							<!-- <pre>{{dataStoreAnalityc}}</pre> -->
							<div class="mobayar-table" v-if="dataStoreAnalityc.length !== 0">
								<table class="daily-report-table">
									<thead>
										<tr>
											<th :rowspan="dataStoreAnalitycLabelUnit.length">DATE</th>
											<th :rowspan="dataStoreAnalitycLabelUnit.length">#</th>
											<th :rowspan="dataStoreAnalitycLabelUnit.length" align="center">TOTAL</th>
											<th :colspan="dataStoreAnalitycLabelUnit.length" align="center">UNIT Jarvis</th>
											<th :rowspan="dataStoreAnalitycLabelUnit.length">AMOUNT</th>
										</tr>
										<tr>
											<th v-for="label in dataStoreAnalitycLabelUnit"
												:key="label"
												v-text="label"></th>
										</tr>
									</thead>
									<tbody
										v-for="(data, index) in dataStoreAnalityc"
										:key="index">
										<tr
											v-for="(datas, indexs) in data.data"
											:key="indexs">
											<td v-if="indexs === 0" :rowspan="data.data.length" style="width:30%">{{data.label}}</td>
											<td>
												<span v-if="datas.status == 'purchase'">Purchase Order</span>
												<span v-else-if="datas.status == 'sale'">Surat Jalan</span>
												<span v-else-if="datas.status == 'invoice'">Invoice Lunas</span>
												<span v-else>Label Tidak Terdaftar</span>
											</td>
											<td align="center">{{datas.count}}</td>
											<td
												v-for="(dataUnit, indexUnit) in datas.units"
												:key="indexUnit"
												align="center">{{dataUnit.total_unit}}</td>
											<td align="center">{{datas.total_unit}}</td>
											<td>{{datas.total}}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</el-col>
					</el-row>
				</div>
				<div class="filterSearching clearfix">
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
				</div>
				<el-row :gutter="20" class="content-chart" v-if="itemsData.length !== 0">
					<el-col :span="24">
						<div class="cards charts-items">
							<div class="header-chart clearfix">
								<h4 style="text-transform: capitalize;">
									Statistik : Klaim Garansi
								</h4>
							</div>
							<el-row :gutter="20">
								<el-col :span="24">
									<canvas id='chart-product-status-claim' height="80"></canvas>
								</el-col>
							</el-row>
						</div>
						<div class="cards charts-items">
							<div class="header-chart clearfix">
								<h4 style="text-transform: capitalize;">
									Statistik : Garansi
								</h4>
							</div>
							<el-row :gutter="20">
								<el-col :span="24">
									<canvas id='chart-product-status-warranty' height="80"></canvas>
								</el-col>
							</el-row>
						</div>
						<div class="cards charts-items">
							<div class="header-chart clearfix">
								<h4 style="text-transform: capitalize;">
									Statistik : Jumlah Tipe Produk
								</h4>
							</div>
							<el-row :gutter="20">
								<el-col :span="24">
									<canvas id='chart-product-status-product' height="80"></canvas>
								</el-col>
							</el-row>
						</div>
						<div class="cards charts-items">
							<div class="header-chart clearfix">
								<h4 style="text-transform: capitalize;">
									Statistik : Jumlah Toko
								</h4>
							</div>
							<el-row :gutter="20">
								<el-col :span="24">
									<canvas id='chart-product-status-store' height="80"></canvas>
								</el-col>
							</el-row>
						</div>
					</el-col>
				</el-row>
				<p class="nodataCharts" v-else>No Data</p>
			</div>
        </div>
	</div>
</template>

<script>
import Chart from 'chart.js'
import pageHeader from '@/components/pageHeader'
import loadingSvg from '@/components/loadingSvg'

let date = new Date()
let firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

export default {
	name: 'dashboard-charts',
    components: { pageHeader, loadingSvg },
    data(){
        return{
			sectionApi: "dashboard",
			dateRange: [this.$FUNCTIONS.formatDate(firstDay), this.$FUNCTIONS.formatDate(lastDay)],
			format: 'yyyy-MM-dd',
			itemsData: [],
			loading: false,
			statistikDataClaim: [],
			statistikDataProduct: [],
			statistikDataStore: [],
			statistikDataWarranty: [],
			dataClaimChart: "",
			dataWarrantyChart: "",
			dataProductChart: "",
			dataStoreChart: "",
			dataStoreAnalityc: [],
			dataStoreAnalitycLabelUnit: [],
			dataEmptyDataUnits: []
		}
	},
	created(){
        this.$FUNCTIONS.checkPermissions(this.$dataRole['.cms.dashboard.get'])
	},
	watch:{
		dateRange: function(newValue, oldValue){
			if(newValue !== null){
				this.getPost()
			}else{
				this.dateRange = oldValue
			}
		}
	},
	mounted(){
		this.getPost()
	},
	methods: {
		async getPost(){
            let url = this.$baseUrl + this.sectionApi + "?start_date=" + this.dateRange[0] + "&end_date=" + this.dateRange[1]
            try{
				this.itemsData = []
				this.statistikDataClaim = []
				this.statistikDataProduct = []
				this.statistikDataStore = []
				this.statistikDataWarranty = []
                this.loading = true
                const response = await this.$services.getList(url)
                this.loading = false
                if(response.status == 200){
					this.itemsData = response.data
					this.initChart()
					this.initDailyReport()
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
                this.loading = false
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
		},
		initChart() {
			if(this.itemsData.length !== 0){
				this.createChartClaim()
				this.createChartWarranty()
				this.createChartProduct()
				this.createChartStore()
			}
		},
		createChartClaim(){
			if(this.itemsData['claim']){
				let that = this
				let dataClaimLabel = [],
				dataClaimAccept = [],
				dataClaimPending = [],
				dataClaimReject = []

				if(this.dataClaimChart && this.dataClaimChart !== null){
					this.dataClaimChart.destroy()
				}

				let filterClaim = _(this.itemsData['claim']).groupBy('date').map((v, date) => ({
					date,
					datas: _(v).groupBy('status').value()
                })).value()
				this.statistikDataClaim = filterClaim

				this.statistikDataClaim.forEach(function(e){
					let formatDate = this.$FUNCTIONS.formatDate(e.date)
					dataClaimLabel.push(formatDate)
					let checkDataAccept = (e.datas['accept']) ? dataClaimAccept.push(e.datas['accept'][0].count) : dataClaimAccept.push(0)
					let checkDataPending = (e.datas['pending']) ? dataClaimPending.push(e.datas['pending'][0].count) : dataClaimPending.push(0)
					let checkDataReject = (e.datas['reject']) ? dataClaimReject.push(e.datas['reject'][0].count) : dataClaimReject.push(0)
				}, this)

				let dataSetClaim = [
					{
						label: 'Accept',
						data: dataClaimAccept,
						fill: false,
						backgroundColor: '#39B54D',
						borderColor: '#39B54D',
						borderWidth: 0
					},
					{
						label: 'Pending',
						data: dataClaimPending,
						fill: false,
						backgroundColor: '#ffcf1f',
						borderColor: '#36495d',
						borderWidth: 0
					},
					{
						label: 'Reject',
						data: dataClaimReject,
						fill: false,
						backgroundColor: '#DC1818',
						borderColor: '#36495d',
						borderWidth: 0
					}
				]

				setTimeout(function(){
					var ctx = document.getElementById('chart-product-status-claim')
					that.dataClaimChart = new Chart(ctx, {
						type: 'bar',
						data: {
							labels: dataClaimLabel,
							datasets: dataSetClaim
						},
						options: {
							responsive: true,
							lineTension: 0,
							scales: {
								xAxes: [{
									categoryPercentage: 0.8,
									barPercentage: 0.7,
									gridLines: {
										display: false
									}
								}],
								yAxes: [{
									ticks: {
										beginAtZero: true
									},
									gridLines: {
										display: true,
										drawBorder: false,
										borderDash: [15]
									}
								}]
							},
							tooltips: {
								enabled: true,
							},
							legend: {
								display: true,
							}
						}
					})
					that.dataClaimChart.update()
				}, 200)
			}
		},
		createChartWarranty(){
			if(this.itemsData['warranty']){
				let that = this
				let dataValueWarranty = [],
				dataLabelWarranty = []

				if(this.dataWarrantyChart && this.dataWarrantyChart !== null){
					this.dataWarrantyChart.destroy()
				}

				let filterWarranty = _(this.itemsData['warranty']).groupBy('date').map((v, date) => ({
					date,
					datas: _(v).value()
				})).value()
				this.statistikDataWarranty = filterWarranty

				this.statistikDataWarranty.forEach(function(e){
					let formatDate = this.$FUNCTIONS.formatDate(e.date)
					dataLabelWarranty.push(formatDate)
					e.datas.forEach(function(dataWarranty){
						dataValueWarranty.push(dataWarranty.count)
					}, this)
				}, this)

				let dataSetWarranty = [
					{
						label: 'Garansi',
						data: dataValueWarranty,
						fill: false,
						backgroundColor: '#39B54D',
						borderColor: '#39B54D',
						borderWidth: 0
					}
				]

				setTimeout(function(){
					var ctx = document.getElementById('chart-product-status-warranty')
					that.dataWarrantyChart = new Chart(ctx, {
						type: 'bar',
						data: {
							labels: dataLabelWarranty,
							datasets: dataSetWarranty
						},
						options: {
							responsive: true,
							lineTension: 0,
							scales: {
								xAxes: [{
									categoryPercentage: 0.8,
									barPercentage: 0.7,
									gridLines: {
										display: false
									}
								}],
								yAxes: [{
									ticks: {
										beginAtZero: true
									},
									gridLines: {
										display: true,
										drawBorder: false,
										borderDash: [15]
									}
								}]
							},
							tooltips: {
								enabled: true,
							},
							legend: {
								display: true,
							}
						}
					})
					that.dataWarrantyChart.update()
				}, 200)
			}
		},
		createChartProduct(){
			if(this.itemsData['product']){
				let that = this
				let dataValueProduct = [],
				dataLabelProduct = []

				if(this.dataProductChart && this.dataProductChart !== null){
					this.dataProductChart.destroy()
				}

				this.statistikDataProduct = this.itemsData['product']
				this.statistikDataProduct.forEach(function(e){
					dataLabelProduct.push(e.name)
					dataValueProduct.push(e.count)
				})

				let dataSetProduct = [
					{
						label: 'Produk',
						data: dataValueProduct,
						fill: false,
						backgroundColor: '#0566FF',
						borderColor: '#39B54D',
						borderWidth: 0
					}
				]

				setTimeout(function(){
					var ctx = document.getElementById('chart-product-status-product')
					that.dataProductChart = new Chart(ctx, {
						type: 'bar',
						data: {
							labels: dataLabelProduct,
							datasets: dataSetProduct
						},
						options: {
							responsive: true,
							lineTension: 0,
							scales: {
								xAxes: [{
									categoryPercentage: 0.8,
									barPercentage: 0.7,
									gridLines: {
										display: false
									}
								}],
								yAxes: [{
									ticks: {
										beginAtZero: true
									},
									gridLines: {
										display: true,
										drawBorder: false,
										borderDash: [15]
									}
								}]
							},
							tooltips: {
								enabled: true,
							},
							legend: {
								display: true,
							}
						}
					})
					that.dataProductChart.update()
				}, 200)
			}
		},
		createChartStore(){
			if(this.itemsData['store']){
				let that = this
				let dataValueStore = [],
				dataLabelStore = []

				if(this.dataStoreChart && this.dataStoreChart !== null){
					this.dataStoreChart.destroy()
				}

				this.statistikDataStore = this.itemsData['store']
				this.statistikDataStore.forEach(function(e){
					dataLabelStore.push(e.name)
					dataValueStore.push(e.count)
				})

				let dataSetStore = [
					{
						label: 'Toko',
						data: dataValueStore,
						fill: false,
						backgroundColor: '#FFCF1F',
						borderColor: '#39B54D',
						borderWidth: 0
					}
				]

				setTimeout(function(){
					var ctx = document.getElementById('chart-product-status-store')
					that.dataStoreChart = new Chart(ctx, {
						type: 'bar',
						data: {
							labels: dataLabelStore,
							datasets: dataSetStore
						},
						options: {
							responsive: true,
							lineTension: 0,
							scales: {
								xAxes: [{
									categoryPercentage: 0.8,
									barPercentage: 0.7,
									gridLines: {
										display: false
									}
								}],
								yAxes: [{
									ticks: {
										beginAtZero: true
									},
									gridLines: {
										display: true,
										drawBorder: false,
										borderDash: [15]
									}
								}]
							},
							tooltips: {
								enabled: true,
							},
							legend: {
								display: true,
							}
						}
					})
					that.dataStoreChart.update()
				}, 200)

			}
		},
		chartAppend(id, labelsValue, datasetsValue){
			setTimeout(function(){
				var ctx = document.getElementById(id)
				var myChart = new Chart(ctx, {
					type: 'bar',
					data: {
						labels: labelsValue,
						datasets: datasetsValue
					},
					options: {
						responsive: true,
						lineTension: 0,
						scales: {
							xAxes: [{
								categoryPercentage: 0.8,
								barPercentage: 0.7,
								gridLines: {
									display: false
								}
							}],
							yAxes: [{
								ticks: {
									beginAtZero: true
								},
								gridLines: {
									display: true,
									drawBorder: false,
									borderDash: [15]
								}
							}]
						},
						tooltips: {
							enabled: true,
						},
						legend: {
							display: true,
						}
					}
				})
				myChart.update()
			}, 200)
		},
		initDailyReport(){
			if(this.itemsData['analytic'] !== undefined){
				this.loading = false
				let dataAnalitic = this.itemsData['analytic']
				// Create Init
				Object.keys(dataAnalitic['label']).forEach((key, index) => {
					this.dataStoreAnalityc.push({
						label: dataAnalitic['label'][key],
						status: key
					})
				}, this)

				Object.keys(dataAnalitic['unit']).forEach((key, index) => {
					this.dataStoreAnalitycLabelUnit.push(dataAnalitic['unit'][key])
				}, this)

				this.dataStoreAnalitycLabelUnit.sort().reverse()

				// create empty data
				this.dataStoreAnalitycLabelUnit.forEach((data, index) => {
					this.dataEmptyDataUnits.push({
						total_unit: 0,
						name: data
					})
				})

				// Create static Data = alltime
				this.dataStoreAnalityc.push({ label: "All The Time", status: "all" })
				this.dataStoreAnalitycLabelUnit.push('Total')
				this.createDataAnalitic(dataAnalitic)
			}
		},
		createDataAnalitic(value){
			this.createDataStructure(value['purchase'], 'purchase', true)
			this.createDataStructure(value['sale'], 'sale', false)
			this.createDataStructure(value['invoice'], 'invoice', false)
		},
		createDataStructure(value, status, isFirst){
			Object.keys(value).forEach((key, index) => {
				this.dataStoreAnalityc.forEach((data, indexs) => {
					if(data.status === key){
						let datas = value[key]
						datas["status"] = status
						// for init array in object data
						if(isFirst){
							this.dataStoreAnalityc[indexs]['data'] = [datas]
						}else{
							this.dataStoreAnalityc[indexs]['data'].push(datas)
						}

						this.dataStoreAnalityc[indexs]['data'].forEach((data, indexdata) => {
							let getName = new Set(data.units.map(d => d.name))
							data.units = [...data.units, ...this.dataEmptyDataUnits.filter(d => !getName.has(d.name))]
							data.units.sort(this.$FUNCTIONS.dynamicSort('name', 'desc'))
						})
					}
				})
			}, this)
		}
	}
}
</script>
<style lang="scss" scoped>
.charts-items{
	margin-bottom: 25px;
}
.nodataCharts{
	background: #fff;
	padding: 15px;
	border-radius: 5px;
	border: solid 1px #DFE4E8;
	text-align: center;
}
.daily-report-table{
	width: 100%;
	thead{
		tr{
			th{
				padding: 12px 15px;
				&[align="center"]{
					text-align: center;
				}
			}
		}
	}
	tbody{
		tr{
			td{
				border-right: 1px solid #dfe4e8;
				padding: 6px 15px;
			}
		}
	}
}
</style>
