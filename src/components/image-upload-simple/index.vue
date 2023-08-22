<template>
	<div class="image-upload-simple" >
			
	
		<input type="file" ref="myFiles" class="custom-file-input" @input="convertImgToBase64($event)"/>
		<span v-if="hasPhoto" class="delete-image"  @click="$emit('deleteImage')">
			<img src="@/assets/svg/icon-close-green.svg" />	
			<img class="blue" src="@/assets/svg/icon-close.svg"/>
			</span>
		<div class="image-upload-simple__container" @click="$refs.myFiles.click()">
			<div class="add-icon"></div>
		</div>
		
		<div class="upload-progress" v-if="uploadPercent > 0">
			{{ uploadPercent }} %
		</div>
	
	</div>
</template>

<script>
	export default {
		data() {
			return {
				files: [],
				imgPreview: null,
				imgSrc: {},
				uploadPercent: 0,
			};
		},
		props:{
			hasPhoto: {
				default:false,
				type:Boolean
				}
		},
		methods: {
			convertImgToBase64() {
				let reader = new FileReader();
				let file = this.$refs.myFiles.files[0];
				this.imgSrc.mimeType = file.type;
				this.imgSrc.name = 'image-' + Date.now();
				this.$refs.myFiles.type = 'text';
				if (
					(file.size < 11000000 && file.type.toLowerCase() === "image/jpeg") ||
					file.type.toLowerCase() === "image/png" ||
					file.type.toLowerCase() === "image/jpg" ||
					file.type.toLowerCase() === "image/tif" ||
					file.type.toLowerCase() === "image/tiff" ||
					file.type.toLowerCase() === "image/gif"
				) {
					reader.onload = event => {
						this.imgPreview = reader.result;
						this.imgSrc.binary = event.target.result.replace(
							/^data:image\/[a-z]+;base64,/,
							""
						);
						this.$emit('ready', this.imgSrc)
					};
					reader.readAsDataURL(file);
					this.$refs.myFiles.type = 'file';
				} else {
					this.$refs.myFiles.type = 'file';
					this.$notify({
						group: "system",
						title: "Bad news!",
						text: "File not allowed or it's too big(over 5 Mb).",
						type: "error"
					});
				}
			},
		}
	};
</script>

<style lang="scss">
@import "./../../style/components/_image-upload-simple.scss";
</style>
