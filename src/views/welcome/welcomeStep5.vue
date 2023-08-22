<template>
  <div class="welcome">
    <div class="welcome__header" :class="{ 'has-back-link': getGroup && getGroup.title }">
      <div class="welcome__logo">
        <router-link :to="{ name: 'Groups' }">
          <img src="@/assets/logo.svg" alt="logo" />
        </router-link>
      </div>
    </div>
    <div class="screen">
      <carousel :per-page="1" :mouse-drag="true">
        <slide>
          <div class="screen__media">
            <div class="screen__information">
              <p class="leftnumber">5 of 6</p>
              <p class="rightskip">Skip</p>
            </div>
            <div>
              <img
                class="screen__image step5"
                src="@/assets/svg/welcomeStep5a.svg"
                alt="screen"
              />
            </div>
            <div class="fifthtext">
              <ol>
                <li>Saved events</li>
                <li>Posts & Announcements</li>
                <li>RSVP for events and get passes directly from the app</li>
                <li>Virtual</li>
                <li>Grow your membership</li>
              </ol>
            </div>
          </div>
        </slide>
        <slide>
          <div class="screen__media">
            <div class="screen__information">
              <p class="leftnumber">5 of 6</p>
              <p class="rightskip">Skip</p>
            </div>
            <div>
              <img
                class="screen__image step52"
                src="@/assets/svg/welcomeStep5b.svg"
                alt="screen"
              />
            </div>
            <div class="fifthstep2">
              <ul>
                <li style="list-style-type: none">
                  5. Notifications and reminders (Push, Email, In-app)
                </li>
              </ul>
            </div>
          </div>
        </slide>
        <slide>
          <div class="screen__media">
            <div class="screen__information">
              <p class="leftnumber">5 of 6</p>
              <p class="rightskip">Skip</p>
            </div>
            <div class="fifthpage step52">
              <div>
                <img
                  class="screen__image"
                  src="@/assets/svg/welcomeStep5c.svg"
                  alt="screen"
                />
              </div>
              <div>
                <img
                  class="screen__image secondimg2"
                  src="@/assets/svg/welcomeStep5c2.svg"
                  alt="screen"
                />
              </div>
            </div>
            <div class="fifthstep2">
              <ul>
                <li style="list-style-type: none">
                  6. Members ask questions to the organizers
                </li>
                <li style="list-style-type: none">7. Comments and discussions</li>
              </ul>
            </div>
          </div>
        </slide>
        <slide>
          <div class="screen__media">
            <div class="screen__information">
              <p class="leftnumber">5 of 6</p>
              <p class="rightskip">Skip</p>
            </div>
            <div class="step52">
              <div>
                <img
                  class="screen__image"
                  src="@/assets/svg/welcomeStep5d.svg"
                  alt="screen"
                />
              </div>
              <div>
                <img
                  class="screen__image secondimg3"
                  src="@/assets/svg/welcomeStep5d2.svg"
                  alt="screen"
                />
              </div>
            </div>
            <div class="fifthstep2">
              <ul>
                <li style="list-style-type: none">7. Comments and discussions</li>
                <li style="list-style-type: none">
                  8. Checkout for events: Everything you need to set up and sell tickets
                  to virtual and in person events
                </li>
              </ul>
            </div>
          </div>
        </slide>
      </carousel>
      <div class="screen__content">
        <h2 class="screen-title">Community engagement tools</h2>
        <p class="screen-about">
          Keep your community engaged and more likely to buy tickets and participate with
          saved events, reminders, and collaboration features.
        </p>
        <c-button
          tag="button"
          variant="outline-info"
          size="sm"
          class="px-10"
          @click="back()"
        >
          Back
        </c-button>
        <c-button tag="button" variant="info" size="sm" class="px-10" @click="nextStep()">
          next
        </c-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "step5",
  data() {
    return {};
  },
  methods: {
    nextStep() {
      this.$router.push({ path: `/welcome/step6` });
    },
    back() {
      this.$router.push({ path: `/welcome/step4` });
    },
  },
};
</script>

<style lang="scss">
@import "./../../style/_welcome.scss";
.step52 {
  float: right;
  width: 53%;
  padding: 13px;
}
.fifthstep2 {
  float: left;
  width: 40%;
  padding: 6px;
}
// .VueCarousel-dot-container {
//     position: absolute;
//     padding: 0;
//     bottom: 9%;
//     right: 0;
//     left: 0;
// }
.step52 img.screen__image {
  float: left;
  width: 46%;
}
li {
  padding: 10px 0px;
  color: #78a7a7;
}
</style>
