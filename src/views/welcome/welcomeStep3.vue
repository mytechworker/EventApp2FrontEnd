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
             <carousel :per-page="1" :mouse-drag="true" >
                  <slide>
                <div class="screen__media">
                <div>
                <img class="screen__image" src="@/assets/svg/welcomeStep3a.svg" alt="screen">
                <div class="text-image">
                   <h3>Invite</h3>
                   <p>Invite all your members to your <br> groups one by one or import from <br> a spreadsheet.</p>
                </div>
                </div>
                </div>
                 </slide>
                      <slide>
                <div class="screen__media">
                <div class="screen__information">
                <p class="leftnumber">3 of 6</p>
                <p class="rightskip">Skip</p>
                </div>
                <div>
                <img class="screen__image" src="@/assets/svg/welcomeStep3b.svg" alt="screen">
                </div>
                 <div>
                <img class="screen__image secondimg" src="@/assets/svg/welcomeStep3b2.svg" alt="screen" style="padding-top:0px;">
                <div class="secondimg-text">
                   <h3>Post</h3>
                   <p>Share posts to keep all <br> your members in the <br> know and up to date</p>
                </div>
                </div>
                </div>
                 </slide>
             </carousel>
          <div class="screen__content">
           <h2 class="screen-title"> Bring your community together</h2>
            <p class="screen-about">Reach new members, drive demand, and build relationships with our powerful, built-in marketing and communication tools.</p>
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
        name: "step3",
		data() {
			return {
			}
		},
methods:{
  nextStep(){
     this.$router.push({ path: `/welcome/step4` });
  },
  back(){
  this.$router.push({path:`/welcome/step2`})
  }
}
    }
</script>

<style lang="scss">
@import "./../../style/_welcome.scss";


img.screen__image.secondimg {position: absolute;top: 66px;z-index: 99999 !important;margin-left: 48%;}

@media only screen and (max-width: 500px) {

.text-image {
    padding-left: 26px;
    position: unset;
    right: 0;
    bottom: 0%;
    color: #6f6f6f;
}
img.screen__image {
    width: 100%;
    padding-top: 71px;
}
.secondimg-text {
    padding: 40px 0px 0px 40px;
    color: #6f6f6f;
}
}



</style>