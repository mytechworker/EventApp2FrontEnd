<template>
	<div class="nav-toggle" @click="menuToggle()" :class="{ open: isOpen }">
		<span></span>
		<span></span>
		<span></span>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				isOpen: false
			};
		},
		methods: {
			menuToggle() {
				this.isOpen = !this.isOpen;
				this.$emit("click");
			}
		},
		watch: {
			isOpen() {
				// let el = document.getElementsByTagName("body")[0];
				// if (this.isOpen) {
				// 	el.style.overflow = "hidden";
				// } else {
				// 	el.style.overflow = "unset";
				// }
			}
		}
	};
</script>

<style lang="scss">
@import "./../../style/components/button/_mobile.scss";
</style>
