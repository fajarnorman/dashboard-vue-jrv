<template>
	<div id="warehouse-component">
		<el-select :disabled="disabled" v-model="realValue" placeholder="Pilih Warehouse">
			<el-option
				v-for="(dataItems, indexItem) in itemsData"
				:key="indexItem"
				:label="dataItems.name"
				:value="dataItems.id"></el-option>
		</el-select>
	</div>
</template>

<script>
export default {
	name: "warehouse-component",
	props: ['value', 'disabled'],
	data(){
		return{
			sectionApi: "warehouse",
			limit: 50,
            page: 1,
			loading: false,
			itemsData: [],
			realValue: "",
			valueLabel: "",
			textErrorNetwork: "Jaringan Bermasalah",
			parentLocations: this.$parent.$parent.$parent.$parent.$parent
		}
	},
	mounted(){
		this.getPost()
	},
	watch: {
		value(newValue, oldValue){
			this.realValue = newValue
		},
		realValue(newValue, oldValue){
			this.parentLocations.forms.warehouse = newValue
		}
	},
	methods: {
		buildUrl(){
			return this.$baseUrl + this.sectionApi + "?limit=" + this.limit + "&page=" + this.page
		},
		async getPost(){
            try{
                this.loading = true
                const response = await this.$services.getList(this.buildUrl())
                this.loading = false
                if(response.status == 200){
                    this.itemsData = response.data.data
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
        },
	}
}
</script>
