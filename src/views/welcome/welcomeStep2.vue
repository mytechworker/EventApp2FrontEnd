<template>
    <div class="welcome">
         <div
        class="welcome__header"
        :class="{ 'has-back-link': getGroup && getGroup.title }"
      >
        <div class="welcome__logo">
          <router-link :to="{ name: 'Groups' }">
            <img src="@/assets/logo.svg" alt="logo" />
          </router-link>
        </div>
      </div>
        <div class="screen">
            <div class="screen__information">
            <p class="leftnumber">2 of 6</p>
            <p class="rightskip">Skip</p>
            </div>
          <div class="screen__media">
            <div>
            <img class="screen__image" src="@/assets/svg/welcomeStep2.svg" alt="screen">
            </div>
          </div>
          <div class="screen__content">
           <h2 class="screen-title"> Create your groups</h2>
            <p class="screen-about">A group is private community space where your members can: Discover the things they love to do within your community, explore events and stay in the know, save events they’re interested in and revisit them later.</p>
                 	<c-button
                tag="button"
                variant="outline-info"
                size="sm"
                class="px-10"
                @click="back()"
              >
                Back
              </c-button>
            	<c-button
                tag="button"
                variant="info"
                size="sm"
                class="px-10"
                @click="nextStep()"
              >
                next
              </c-button>
              
         
          </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "step2",
		data() {
			return {
			}
		},
methods:{
  nextStep(){
     this.$router.push({ path: `/welcome/step3` });
  },
  back(){
  this.$router.push({path:`/welcome`})
  }
}
    }
</script>

<style lang="scss">
@import "./../../style/_welcome.scss";
@media only screen and (max-width: 768px) {
img.screen__image {
    width: 100%;
    padding-top: 57px;
}
.text-image {
    padding-left: 26px;
    position: unset !important;
    right: 0;
    bottom: 0%;
    color: #6f6f6f;
}
}
</style>