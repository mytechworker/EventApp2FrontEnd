<template>
	<div class="form-group">
		<label class="form-group__label">
			{{ label }}
			<sup style="color: red" v-if="required">*</sup>
		</label>
		<div class="form-group__field">
			<slot/>
		</div>
		<div class="form-group__append" v-if="append">
			{{ append }}
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			label: {
				type: String,
			},
			append: {
				type: String
			},
			required: {
				type: Boolean,
				default: false
			}
		}
	}
</script>

<style lang="scss">
@import "./../../style/components/_form-group.scss";
</style>
