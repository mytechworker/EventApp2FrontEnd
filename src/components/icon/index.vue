<template>
  <div class="icon" :class="[`icon--${name}`, `icon--${size}`, { 'has-align-fix': fixAlign }]">
    <img svg-inline :src='"@/assets/svg/editor-icons/"+name+".svg"' height="14px" width="14px" />
  </div>
</template>

<script>
export default {
  props: {
    name: {},
    size: {
      default: 'normal',
    },
    modifier: {
      default: null,
    },
    fixAlign: {
      default: true,
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./../../style/components/_icon.scss";
</style>