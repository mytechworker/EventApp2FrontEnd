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
          <div class="screen__media">
            <div class="screen__information">
            <p class="leftnumber">6 of 6</p>
            <p class="rightskip">Skip</p>
            </div>
            <div>
            <img class="screen__image laststep6" src="@/assets/svg/welcomeStep6.svg" alt="screen">
            </div>
            <div class="laststep">
              <div class="text">
                 <h4>Don't have the YouToo mobile app yet?</h4>
                </div>

              <div>
            <img class="screen__image" src="@/assets/svg/welcomeStep6b.svg" alt="screen">
            </div>
            </div>
          </div>
          <div class="screen__content">
           <h2 class="screen-title"> Member apps</h2>
            <p class="screen-about">Get the YouToo apps for Android and iPhone.</p>
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
                Get Start
              </c-button>
              
         
          </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "step6",
		data() {
			return {
			}
		},
methods:{
  nextStep(){
    //  this.$router.push({ path: `/welcome/step3` });
  },
  back(){
  this.$router.push({path:`/welcome/step5`})
  }
}
    }
</script>

<style lang="scss">
@import "./../../style/_welcome.scss";

img.screen__image.laststep6 {
    float: left;
    width: 28%;
    padding-top: 28px;
    padding-left: 20px;
}img.screen__image.laststep6 {
    text-align: right;
}

.laststep {
    float: right;
    width: 50%;
    padding: 62px;
}

h4 {
    font-size: 18px;
    font-weight: 700;
    line-height: 23.81px;
    padding-bottom: 29px;
}

.text {
    padding-left: 33px;
}

@media only screen and (max-width: 500px) {
  img.screen__image.laststep6 {
    float: unset;
    width: unset;
    padding-top: 28px;
    padding-left: 20px;
}

img.screen__image.laststep6 {
    text-align: right;
}

.laststep {
    float: right;
    width: 100%;
    padding: 10px;
    text-align: center;
}

h4 {
    font-size: 18px;
    font-weight: 700;
    line-height: 23.81px;
    padding-bottom: 29px;
}
.text {
    padding-left: 0px;
}

.laststep img.screen__image {
    display: unset;
}
}
</style>