<template>
	<div>
		<input type="file" ref="myFiles" id="importFile" class="custom-file-input" @change="checkFile($event)"/>
		<c-button
			tag="button"
			variant="info"
			size="sm"
      class="px-10"
			@click="$refs.myFiles.click()"
		>
			<slot />
		</c-button>

		<div class="upload-progress" v-if="uploadPercent > 0">
			{{ uploadPercent }} %
		</div>
	</div>
</template>

<script>
	import urls from "../../common/urls";

	export default {
		props: {
			files: [Array, Object],
			showBg: {
				type: Boolean,
				default: true
			},
			endpoint: {
				type: String
			}
		},
		data() {
			return {
				newFile: {},
				uploadPercent: 0
			};
		},
		methods: {
			checkFile() {
				let reader = new FileReader();
				let file = this.$refs.myFiles.files[0];
				if (
					(
					file.size < 10000000 && file.type.toLowerCase() !== "application/javascript") ||
					file.size < 10000000 && file.type.toLowerCase() !== "application/x-javascript" ||
					file.size < 10000000 && file.type.toLowerCase() !== "application/ecmascript" ||
					file.size < 10000000 && file.type.toLowerCase() !== "text/javascript" ||
					file.size < 10000000 && file.type.toLowerCase() !== "text/ecmascript" ||
					file.size < 10000000 && file.type.toLowerCase() !== "application/json" ||
					file.size < 10000000 && file.type.toLowerCase() !== "application/zip" ||
					file.size < 10000000 && file.type.toLowerCase() !== "application/gzip" ||
					file.size < 10000000 && file.type.toLowerCase() !== "application/x-php" ||
					file.size < 10000000 && file.type.toLowerCase() !== "application/xml" ||
					file.size < 10000000 && file.type.toLowerCase() !== "text/xml" ||
					file.size < 10000000 && file.type.toLowerCase() !== "text/x-script.phyton"
				) {
					this.newFile.contentType = file.type;
					this.newFile.filename = file.name;
					this.newFile.id = 0;
					this.newFile.createdOnUtc = new Date();
					this.newFile.extension = file.name.split(".").pop();
					reader.onload = event => {
						let base64 = event.target.result;
						if (base64.includes("data:application")) {
							this.newFile.binary = base64.replace(
								/^data:application\/[A-Za-z0-9_.~-]+;base64,/,
								""
							);
						} else if (base64.includes("data:image")) {
							this.newFile.binary = base64.replace(
								/^data:image\/[a-z]+;base64,/,
								""
							);
						}
						this.uploadFile();
					};
					reader.readAsDataURL(file);

				} else {
					this.$notify({
						group: "system",
						title: "Bad news!",
						text: "File not allowed or it's too big(over 20 Mb).",
						type: "error"
					});
				}
			},
			uploadFile() {
				this.setLoadingStatus(true);
				this.uploadPercent = 0;
				this.$http({
					url: urls[this.endpoint],
					method: "POST",
					data: {files: [this.newFile]},
					headers: {
						"Content-Type": "application/json",
						'Cache-Control': 'no-cache',
						"Pragma": "no-cache",
						"Authorization": "Bearer " + this.$cookies.get('userEventAppToken')
					},
					onUploadProgress: (progressEvent) => {
						const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
						this.uploadPercent = Math.round((progressEvent.loaded * 100) / totalLength);
					}
				})
					.catch((response) => {
						this.setLoadingStatus(false);
						this.uploadPercent = 0;
						this.$notify({
							group: "system",
							title: "Oops!",
							text: 'Error during import.',
							type: "error"
						})
						console.log(response.data)
					})
					.then(response => {
						this.setLoadingStatus(false);
						this.uploadPercent = 0;
						if (response && response.status === 200) {
							this.$emit("onUploadResponse", response);
							this.newFile = {};

							const input = this.$refs.myFiles;
							input.type = 'text';
							input.type = 'file';
							this.$notify({
								group: "system",
								title: "Great!",
								text: "Your file has been imported!",
								type: "success"
							});
						} else {
							this.newFile = {};

							const input = this.$refs.myFiles;
							input.type = 'text';
							input.type = 'file';
							this.$notify({
								group: "system",
								title: "Oops!",
								text: 'Error during import.',
								type: "error"
							})
						}
					});
			},
		}
	};
</script>

<style lang="scss" scoped>
@import "./../../style/components/_file-uploader.scss";
</style>
