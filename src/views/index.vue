<template>
	<c-base>
		<router-view />
	</c-base>
</template>

<script>
	export default {
		components: {
			'c-base': () => import('@/layouts/base')
		},
	}
</script>

<style lang="scss">
	.navs-grid{
		display: flex;
		&__item{
			display: flex;
			flex-direction: column;
			width: 300px;
			padding: 40px 0;
			background: #fff;
			justify-content: center;
			align-items: center;
			text-align: center;
			border: 1px solid #e1e5ed;
			box-shadow: 0 0 5px rgba(0, 0, 0, .1);
			border-radius: 4px;
			font-size: 24px;
			font-weight: 600;
			color: #222;
			text-decoration: none;
			&:hover{
				box-shadow: 0 0 5px rgba(0, 0, 0, .2);
			}
			img{
				height: 50px;
				margin-bottom: 20px;
			}
		}
	}
</style>
