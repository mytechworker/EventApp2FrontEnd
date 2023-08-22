<template>
	<div class="checkbox" :class="`checkbox--${type}` ">
		<input
			:id="id"
			type="checkbox"
			:checked="checked"
			v-bind="$attrs"
			:class="type"
			@change="$emit('change', $event.target.checked)"
		/>
		<label :for="id">
			<slot/>
		</label>
	</div>
</template>

<script>
	export default {
		inheritAttrs: false,
		model: {
			prop: "checked",
			event: "change"
		},
		props: {
			plain: {
				type: Boolean,
				default: false,
			},
			id: {
				type: [String, Number],
				default() {
					return `checkbox-${parseInt(
						Math.random() * new Date().getUTCMilliseconds() * 5
					)}`;
				}
			},
			checked: [Boolean, String],
			type: {
				type: String,
				default: "square",
				validator: val => ["circle", "square", "switcher"].includes(val)
			},
		},
	};
</script>

<style lang="scss">
@import "./../../style/components/_checkbox.scss";
</style>
