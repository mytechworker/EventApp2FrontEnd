<template>
	<div>
		<div class="h2 mb-20">
			Download file
		</div>
		<div class="form-wrap">
			<div class="form-wrap__column w-100">
				<a class="file-uploader__file-description">You can download result: </a>
				<a class="file-uploader__file-name"
					:href="model.fileUrl">{{ model.fileName }}</a>
			</div>
			<div class="w-100 mt-20 text-right">
				<c-button variant="outline-info"
				          tag="button"
				          @click="$store.dispatch('setActiveModal', null)"
				          size="sm"
				          class="mr-20 px-15">
					Close
				</c-button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				model: {
					file: {},
					fileUrl: "",
					fileName: ""
				}
			}
		},
		methods:{
		},
		mounted(){
			this.model.file = this.$store.getters.getCurrentFile;
			this.model.fileUrl = this.model.file ? this.model.file.url : "";
			this.model.fileName = this.model.file && this.model.file.name ? this.model.file.name : "file";
		},
		beforeDestroy() {
			this.$store.dispatch('setCurrentFile', {});
			this.$store.dispatch('setActiveModal', null)
		}
	}
</script>

<style lang="scss">
@import "./../../style/components/modals/_downloadFile.scss";
</style>
