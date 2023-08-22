<template>
	<ValidationProvider :rules="inputRules" :mode="modeType" v-slot="{ errors }" tag="div" style="position: relative">
		<input  ref="input"
				:value="value"
				:type="type"
				class="c-input"
				:class="{'c-input--start': start, 'c-input--disabled': disabled, 'c-input--error': errors && errors.length}"
				:placeholder="placeholder"
				:name="name"
				:disabled="disabled"
				@input="$emit('input', $event.target.value)"
				@keydown.enter="$emit('onEnter')"
				v-bind="$attrs"/>
		<span class="error-text">{{ errors[0] }}</span>
		<span class="c-input__required" v-if="rules && rules.required">
			*
		</span>
	</ValidationProvider>
</template>
<!--
				:style="{ backgroundImage: 'url(' + getUrlSvg() + icon + ')'}"
-->

<script>
	import Inputmask from "inputmask";
	import urls from "../../common/urls";

	export default {
		inheritAttrs: true,
		props: {
			value: {
				type: [String, Number],
				default: ""
			},
			placeholder: {
				type: String,
				default: ""
			},
			name: {
				type: String,
				default: ""
			},
			type: {
				type: String,
				default: ""
			},
			icon: {
				type: String,
				default: ""
			},
			start: {
				type: Boolean,
				default: false
			},
			disabled: {
				type: Boolean,
				default: false
			},
			rules: {
				type: Object,
				default: () => {}
			},
			isPhone: {
				type: Boolean,
				default: false
			},
		},
		data(){
			return{
				inputRules: null,
				modeType: 'lazy'
			}
		},
		mounted() {
			this.$el.value = this.value ? this.value : null;
			this.fieldValid()
			if (this.isPhone) {
				Inputmask({
					mask: "(999) 999-9999",
					greedy: false,
					skipOptionalPartCharacter: true,
					placeholder: "*",
					clearIncomplete: true
				}).mask(this.$refs.input);
			}
		},
		methods: {
			fieldValid(){
				if (this.rules){
					this.inputRules = this.rules;
					if (this.rules.type) {
						this.modeType = this.inputRules.type;
						delete this.inputRules.type
					}
				}
			},
			getUrlSvg(){
				return urls.URL_SVG;
			}
		},
		watch: {
			value() {
				this.$el.value = this.value ? this.value : null;
			},
			rules() {
				this.fieldValid()
			}
		}
	};
</script>

<style lang="scss">
@import "./../../style/components/_input.scss";
</style>
