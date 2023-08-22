<template>
	<component
		:is="tag"
		:to="to"
		:target="target"
		@click="click"
		class="c-button"
		:class="[btnSize, btnVariant, { 'c-button--disabled': disabled }]"
		:style="`border-radius: ${radius}px`">
		<slot/>
	</component>
</template>

<script>
	export default {
		name: "c-button",
		props: {
			tag: {
				type: String,
				default: "router-link"
			},
			to: {
				type: [String, Object],
				default: ""
			},
			target: {
				type: String,
				default: "_self"
			},
			variant: {
				type: String,
				default: "default"
			},
			disabled: {
				type: Boolean,
				default: false
			},
			radius: {
				type: String,
				default: "4"
			},
			size: {
				type: String,
				default: "lg"
			}
		},
		methods: {
			click() {
				this.$emit("click");
			}
		},
		computed: {
			btnVariant() {
				switch (this.variant) {
					case "success":
						return "c-button--success";
					case "warning":
						return "c-button--warning";
					case "info":
						return "c-button--info";
					case "default":
						return "c-button--default";
					case "plain":
						return "c-button--plain";
					case "outline-default":
						return "c-button--outline-default";
					case "outline-success":
						return "c-button--outline-success";
					case "outline-info":
						return "c-button--outline-info";
					case "outline-warning":
						return "c-button--outline-warning";
					default:
						return "c-button--info";
				}
			},
			btnSize() {
				switch (this.size) {
					case "xs":
						return "c-button--xs";
					case "sm":
						return "c-button--sm";
					case "md":
						return "c-button--md";
					case "lg":
						return "c-button--lg";
					default:
						return "c-button--md";
				}
			}
		}
	};
</script>

<style lang="scss">
@import "./../../style/components/button/_index.scss";
</style>
