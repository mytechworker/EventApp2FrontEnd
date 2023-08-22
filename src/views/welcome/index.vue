<template>
  <div class="welcome">
    <div class="welcome__header">
      <div class="welcome__logo">
        <router-link :to="{ name: 'Groups' }">
          <img src="@/assets/logo.svg" alt="logo" />
        </router-link>
        <div class="header__information">
          <p class="leftnumber">{{ step }} of 6</p>
          <router-link tag="a" :to="{ name: 'Main' }" class="rightskip">
            Skip
          </router-link>
        </div>
      </div>
    </div>
    <div class="screen">
      <div class="screen__information">
        <p class="leftnumber">{{ step }} of 6</p>
        <router-link tag="a" :to="{ name: 'Main' }" class="rightskip"> Skip </router-link>
      </div>
      <div>
        <div class="step1" v-show="step == 1">
          <div class="screen__media">
            <div>
              <img
                class="screen__image step1__img"
                src="@/assets/img/Mask Group.png"
                alt="screen"
              />
            </div>
          </div>
          <div class="screen__content">
            <h2 class="screen-title">Welcome to YouToo</h2>
            <p class="screen-about">
              This is where you manage your events. Let's get acquainted with the
              capabilities of our application.
            </p>
          </div>
        </div>
        <div class="step2" v-show="step == 2">
          <div class="screen__media">
            <div>
              <img
                class="screen__image step2__img"
                src="@/assets/img/Group 963.png"
                alt="screen"
              />
            </div>
          </div>
          <div class="screen__content">
            <h2 class="screen-title">Create your groups</h2>
            <p class="screen-about">
              A group is private community space where your members can: Discover the
              things they love to do within your community, explore events and stay in the
              know, save events they’re interested in and revisit them later.
            </p>
          </div>
        </div>
        <div class="step3" v-show="step == 3">
          <carousel :per-page="1" :mouse-drag="true">
            <slide>
              <div class="screen__media">
                <div class="step__three-row1">
                  <img
                    class="screen__image"
                    src="@/assets/svg/welcomeStep3a.svg"
                    alt="screen"
                  />
                  <div class="text-image">
                    <h3>Invite</h3>
                    <p>
                      Invite all your members to your <br />
                      groups one by one or import from <br />
                      a spreadsheet.
                    </p>
                  </div>
                </div>
              </div>
            </slide>
            <slide>
              <div class="screen__media step3__wrapper">
                <div>
                  <img
                    class="screen__image step3__image-2"
                    src="@/assets/img/Group 1005.png"
                    alt="screen"
                  />
                </div>
                <div class="step3__img-text">
                  <div class="secondimg-text">
                    <h3>Post</h3>
                    <p>
                      Share posts to keep all <br />
                      your members in the <br />
                      know and up to date
                    </p>
                  </div>
                </div>
              </div>
            </slide>
          </carousel>
          <div class="screen__content">
            <h2 class="screen-title">Bring your community together</h2>
            <p class="screen-about">
              Reach new members, drive demand, and build relationships with our powerful,
              built-in marketing and communication tools.
            </p>
          </div>
        </div>
        <div class="step4" v-show="step == 4">
          <carousel :per-page="1" :mouse-drag="true">
            <slide>
              <div class="screen__media">
                <div>
                  <img
                    class="screen__image step4"
                    src="@/assets/img/imgbar.png"
                    alt="screen"
                  />
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
                <div>
                  <img
                    class="screen__image secondimg1 img__step4-2"
                    src="@/assets/img/Group 970.png"
                    alt="screen"
                  />
                </div>
              </div>
            </slide>
          </carousel>
          <div class="screen__content">
            <h2 class="screen-title">Bring your community together</h2>
            <p class="screen-about">
              Reach new members, drive demand, and build relationships with our powerful,
              built-in marketing and communication tools.
            </p>
          </div>
        </div>
        <div class="step5" v-show="step == 5">
          <carousel :per-page="1" :mouse-drag="true">
            <slide>
              <div class="screen__media">
                <div class="fifth__first-row">
                  <div class="fifthtext">
                    <ol>
                      <li>Saved events</li>
                      <li>Posts & Announcements</li>
                      <li>RSVP for events and get passes directly from the app</li>
                      <li>Virtual</li>
                      <li>Grow your membership</li>
                    </ol>
                  </div>
                  <img
                    class="screen__image step5 img__step5-1"
                    src="@/assets/img/Group 972.png"
                    alt="screen"
                  />
                </div>
              </div>
            </slide>
            <slide>
              <div class="screen__media">
                <div>
                  <img
                    class="screen__image step52 img__step5-2"
                    src="@/assets/img/Group 977.png"
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
                <div class="fifthpage step52 img__step5-3">
                  <div>
                    <img
                      class="screen__image"
                      src="@/assets/img/Group 1010.png"
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
                <div class="step52 img__step5-5">
                  <div>
                    <img
                      class="screen__image"
                      src="@/assets/img/Group 1009.png"
                      alt="screen"
                    />
                  </div>
                </div>
                <div class="fifthstep2">
                  <ul>
                    <li style="list-style-type: none">7. Comments and discussions</li>
                    <li style="list-style-type: none">
                      8. Checkout for events: Everything you need to set up and sell
                      tickets to virtual and in person events
                    </li>
                  </ul>
                </div>
              </div>
            </slide>
          </carousel>
          <div class="screen__content">
            <h2 class="screen-title">Community engagement tools</h2>
            <p class="screen-about">
              Keep your community engaged and more likely to buy tickets and participate
              with saved events, reminders, and collaboration features.
            </p>
          </div>
        </div>
        <div class="step6" v-show="step == 6">
          <div class="screen__media">
            <div class="screen__media-last">
              <div class="grouped_last-img">
                <img
                  class="screen__image laststep6"
                  src="@/assets/img/screens-sd 3.png"
                  alt="screen"
                />
                <img
                  class="screen__image laststep6"
                  src="@/assets/img/screens-sd 2.png"
                  alt="screen"
                />
              </div>
              <div class="laststep">
                <div class="text">
                  <h4>Don't have the YouToo mobile app yet?</h4>
                </div>

                <div class="last_slide-download">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.youtooapp.alpha"
                    target="_blank"
                  >
                    <img
                      class="screen__image"
                      src="@/assets/img/google-play-badge-1.png"
                      alt="screen"
                    />
                  </a>
                  <a
                    href="https://apps.apple.com/us/app/youtoo-community-events/id1549637429"
                    target="_blank"
                  >
                    <img
                      class="screen__image"
                      src="@/assets/img/aivalable-on-the-app-store-2.png"
                      alt="screen"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="screen__content">
            <h2 class="screen-title">Member apps</h2>
            <p class="screen-about">Get the YouToo apps for Android and iPhone.</p>
          </div>
        </div>
      </div>
      <div class="screen__navigation">
        <c-button
          tag="button"
          variant="outline-info"
          size="sm"
          class="px-10"
          @click="prevStep"
        >
          Back
        </c-button>
        <c-button tag="button" variant="info" size="sm" class="px-10" @click="nextStep()">
          {{ stepText }}
        </c-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      step: 1,
    };
  },
  computed: {
    stepText() {
      if (this.step == 6) {
        return "Get started";
      } else {
        return "Next";
      }
    },
  },
  methods: {
    nextStep() {
      if (this.step <= 5) {
        this.step++;
      } else {
        this.$router.push({ path: `/groups/` });
      }
    },
    prevStep() {
      if (this.step >= 2) {
        this.step--;
      }
    },
  },
};
</script>

<style lang="scss">
@import "./../../style/_welcome.scss";
.header__information {
  display: none;
}
.welcome .screen__content {
  padding: 15px 100px 30px;
}
.screen {
  margin-top: 50px;
  position: relative;
}
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
.fifth__first-row {
  display: flex;
}
.VueCarousel-dot-container {
  position: absolute;
  padding: 0;
  bottom: -6%;
  right: 0;
  left: 0;
}
// .step52 img.screen__image {
//   float: left;
//   width: 46%;
// }
li {
  padding: 10px 0px;
  color: #78a7a7;
}

.text-fourthimg {
  float: left;
  padding: 26px;
  width: 43%;
}
.text-fourthimg ol li {
  padding: 10px 0px;
  color: #78a7a7;
}

img.step4 {
  float: right;
  padding-top: 20px;
  width: 46%;
}
.step__three-row1 {
  position: relative;
}
button.VueCarousel-dot.VueCarousel-dot--active {
  background-color: #2889fc !important;
}
button.VueCarousel-dot {
  background-color: #c4c4c4 !important;
}
.screen__media-last {
  display: flex;
  justify-content: center;
  align-items: center;
}
.laststep {
  width: 159px;
  margin-left: 25px;
  .text > h4 {
    font-weight: bold;
    font-size: 18px;
    line-height: 24px;
    color: #2e425a;
  }
}
img.screen__image.laststep6 {
  width: 138px;
}
.grouped_last-img {
  display: flex;
}
.step1__img {
  width: 505px;
}
.step2__img {
  width: 353px;
}
.step3__wrapper {
  position: relative;
  .step3__img-text {
    position: absolute;
    top: 100px;
  }
}
.step3__image-2 {
  width: 407px;
}
.img__step4-2 {
  width: 463px;
}
.img__step5-1 {
  width: 300px;
}
.img__step5-2 {
  width: 378px;
}
.img__step5-3 {
  div {
    img {
      width: 295px;
    }
  }
}
.img__step5-4 {
  width: 378px;
}
.img__step5-5 {
  div {
    img {
      width: 287px;
    }
  }
}

.last_slide-download {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  a {
    img {
      width: 160px;
    }
  }
}

@media only screen and (max-width: 670px) {
  .welcome__logo {
    display: flex;
    align-items: center;
    width: 100%;
    position: relative;
    a {
      img {
        width: 68px;
      }
    }
    .header__information {
      display: flex;
      align-items: center;
      margin-left: auto;
      font-size: 14px;
      width: 100%;
      color: #303546;
      .leftnumber {
        font-size: 14px;
        color: #303546;
        margin-left: auto;
        margin-right: auto;
      }

      .rightskip {
        font-size: 14px;
        color: #303546;
        cursor: pointer;
        width: 78px;
        text-align: right;
        padding-right: 18px;
      }
    }
  }
  .welcome__header {
    margin-bottom: 0px;
  }
  .screen {
    width: 100% !important;
    margin-bottom: 0px !important;

    &__information {
      display: none !important;
    }
    .step1__img {
      width: 300px;
      margin-top: 61px;
    }
    .step2 {
      .screen__content {
        padding: 15px 35px 30px;
      }
    }
    .step__three-row1 {
      img {
        width: 66%;
      }
      .text-image {
        right: 2%;
        bottom: -15%;
      }
    }
    .step3__img-text {
      top: 89px;
      left: -55px;
    }
    .fifth__first-row {
      .img__step5-1 {
        width: 272px;
        height: 292px;
      }
    }
    .img__step5-2 {
      width: 298px;
    }
    .img__step5-3 {
      width: 60%;
      div {
        img {
          width: 272px;
          height: 292px;
        }
      }
    }
    .img__step5-5 {
      width: 60%;
      div {
        img {
          width: 272px;
        }
      }
    }
    .screen__media-last {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      text-align: center;
      margin-top: 30px;
      .laststep {
        width: 99%;
        margin-left: 0px;
      }
    }
    .last_slide-download {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin-top: 20px;
      a {
        img {
          width: 160px;
        }
      }
    }
    .laststep .text > h4 {
      font-weight: bold;
      font-size: 16px;
      line-height: 24px;
      color: #637e9d;
      margin-top: 15px;
    }
  }
}

@media only screen and (max-width: 368px) {
  .screen {
    .step2__img {
      width: 300px;
      padding: 54px 38px 0 38px;
    }
    .step3__image-2 {
      width: 267px;
      margin-bottom: 90px !important;
    }
    .step__three-row1 {
      .text-image {
        right: 5%;
        bottom: -80%;
      }
    }
    .step3__img-text {
      top: 131px;
      left: -87px;
    }
    .img__step4-2 {
      width: 297px;
    }
    .fifth__first-row {
      display: flex;
      flex-direction: column-reverse;
    }
    .step52 {
      float: unset;
      width: 100% !important;
      padding: 9px 18px !important;
    }
  }
}
</style>
