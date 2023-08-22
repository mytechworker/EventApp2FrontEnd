<template>
<div class="model-section">
	<div class="modal">
		<div class="modal__dialog">
			<slot />
		</div>
	</div>
  </div>
</template>

<script>
export default {
  mounted() {
    document.body.classList.add('modal-opened');
  },
  beforeDestroy() {
    document.body.classList.remove('modal-opened');
  }
}
</script>

<style lang="scss">
@import "./../../style/components/modals/_index.scss";
</style>
