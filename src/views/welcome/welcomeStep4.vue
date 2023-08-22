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
                <div class="screen__information">
                <p class="leftnumber">4 of 6</p>
                <p class="rightskip">Skip</p>
                </div>
                <div>
                <img class="screen__image step4" src="@/assets/svg/welcomeStep4a.svg" alt="screen">
                </div>
                <div class="text-fourthimg">
                     <ol>
                       <li>Recurring events</li>
                       <li>Quorum & Capacity</li>
                       <li>Draft</li>
                       <li>Virtual events</li>
                       <li>Filters (I am interested in)</li>
                       </ol>
                  </div>
                </div>
                 </slide>
                      <slide>
                <div class="screen__media">
                <div class="screen__information">
                <p class="leftnumber">4 of 6</p>
                <p class="rightskip">Skip</p>
                </div>
                <div>
                <img class="screen__image step41" src="@/assets/svg/welcomeStep4b.svg" alt="screen">
                </div>
                 <div>
                <img class="screen__image secondimg1 step41" src="@/assets/svg/welcomeStep4b2.svg" alt="screen">
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
        name: "step4",
		data() {
			return {
			}
		},
methods:{
  nextStep(){
     this.$router.push({ path: `/welcome/step5` });
  },
  back(){
  this.$router.push({path:`/welcome/step3`})
  }
}
    }
</script>

<style lang="scss">
@import "./../../style/_welcome.scss";

.text-fourthimg {
    float: left;
    padding: 26px;
    width: 43%;
}
// .VueCarousel-dot-container {
//     position: absolute;
//     padding: 0;
//     bottom: 39%;
// }
.text-fourthimg ol li {
   padding:10px 0px;
   color:#78a7a7;
}

img.step4 {
    float: right;
    padding-top: 20px;
    width: 46%;
}

</style>