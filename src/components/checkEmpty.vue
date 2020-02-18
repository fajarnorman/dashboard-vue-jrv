<template>
	<div class="check-empty-text">
		<span v-if="value !== '' && value !== null">{{value}}</span>
		<span v-else>-</span>
	</div>
</template>

<script>
export default {
	name: 'check-empty-component',
	props: ['value']
}
</script>
