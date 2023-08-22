<template>
	<div>
		<div class="h1 mb-20">
			Add New Group
		</div>
		<div class="form-wrap">
			<div class="form-wrap__column w-100">
				<c-input placeholder="Group name" v-model="model.title" class="mb-10 w-100"/>
				<c-textarea class="w-100"
				            height="115px"
				            v-model="model.description"
				            placeholder="Description"/>
			</div>
			<div class="w-100 mt-20 text-right form-wrap__buttons">
				<c-button variant="outline-info"
				          tag="button"
				          @click="$store.dispatch('setActiveModal', null)"
				          size="sm"
				          class="px-15 btn-cancel">
					Cancel
				</c-button>
				<c-button tag="button"
				          variant="info"
				          size="sm"
				          class="px-15 btn-create"
				          @click="createGroup">
					Create group
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
					title: '',
					description: '',
					events: [],
					groupUsers: [],
					users: []
				}
			}
		},
		methods:{
			createGroup(){
				this.setLoadingStatus(true);
				this.makeRequest('GROUP_CREATE', 'POST', this.model)
					.then( res => {
						if(res.status === 200){
							this.$store.dispatch("searchGroup");
							this.$store.dispatch('setActiveModal', null);
						}
					})
			}
		},
		beforeDestroy() {
			this.$store.dispatch('setActiveModal', null)
		}
	}
</script>

<style lang="scss">
	@import "./../../style/components/modals/_new-group.scss";
</style>
