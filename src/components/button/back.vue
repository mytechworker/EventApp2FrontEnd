<template>
    <router-link :to="{name: routName}" class="btn-back">
        <img svg-inline src="@/assets/svg/back.svg" alt="" class="icon-back mr-10">
        <slot></slot>
    </router-link>
</template>

<script>
    export default {
        name: "back",
        props: {
            routName: String,
        }
    }
</script>

<style lang="scss">
@import "./../../style/components/button/_back.scss";
</style>