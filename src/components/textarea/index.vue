<template>
	<ValidationProvider :rules="rules" :mode="rules ? rules.type : 'lazy'" v-slot="{ errors }" tag="div"
	                    style="position: relative">
		<textarea ref="textarea"
		          :value="value"
		          class="c-textarea"
		          :class="{'c-textarea--disabled': disabled, 'c-textarea--error': errors && errors.length}"
		          :placeholder="placeholder"
		          :style="`height: ${height}`"
		          :name="name"
		          :disabled="disabled"
		          @input="$emit('input', $event.target.value)"
		          @keydown.enter="$emit('onEnter')"
		          v-bind="$attrs"/>
		<span class="error-text">{{ errors[0] }}</span>
		<span class="c-textarea__required" v-if="rules && rules.required">
			*
		</span>
	</ValidationProvider>
</template>

<script>

	export default {
		inheritAttrs: true,
		props: {
			value: {
				type: String,
				default: ""
			},
			placeholder: {
				type: String,
				default: ""
			},
			height: {
				type: String,
				default: "auto"
			},
			name: {
				type: String,
				default: ""
			},
			disabled: {
				type: Boolean,
				default: false
			},
			rules: {
				type: Object,
				default: () => {
				}
			},
		},
		mounted() {
			this.$el.value = this.value ? this.value : null;
		},
		watch: {
			value() {
				this.$el.value = this.value ? this.value : null;
			}
		}
	};
</script>

<style lang="scss">
	@import "./../../style/components/_textarea.scss";
</style>
