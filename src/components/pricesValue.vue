<template>
	<div class="prices-value">
		<span v-if="value !== '' && value !== null">
			{{currency}} {{formatPrice(value)}}
		</span>
		<span v-else>-</span>
	</div>
</template>

<script>
export default {
	name: "prices-component",
	props: ['value', 'currency'],
	methods:{
		formatPrice(val){
            return this.$FUNCTIONS.formatPrice(val)
        }
	}
}
</script>

<style>

</style>
