<template>
	<button class="back-to-top goTop" v-scroll="handleScroll" @click="backToTop">
		Up
	</button>
</template>

<script>
	export default {
		data: function () {
			return {
				isVisible: false
			};
		},
		methods: {
			backToTop() {
				window.scrollTo(0, 0);
			},
			handleScroll(evt, el) {
				if (window.scrollY > 250) {
					el.setAttribute("style", "opacity: 1; z-index: 100");
				} else {
					el.setAttribute("style", "opacity: 0; z-index: -1");
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
@import "./../../style/components/button/_backToTop.scss";
</style>
