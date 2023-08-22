<template>
  <section class="reg">
    <div class="welcomeimg" v-if="!emailSent">
      <div v-if="typeEntry === 'Sign Up'">
        <img svg-inline src="@/assets/svg/signUp.svg" alt="signUp" />
      </div>
    </div>
    <div class="reg__cont">
      <template v-if="!emailSent">
        <div class="h1" v-if="typeEntry === 'Sign In'">Sign In</div>
        <div class="h1" v-if="typeEntry === 'Sign Up'">Create an Account</div>
        <br />
        <c-button
          v-if="typeEntry === 'Sign In'"
          class="w-100 mt-20"
          tag="button"
          variant="outline-default"
          size="lg"
          @click="facebookHandler"
        >
          <img svg-inline class="mr-15" src="@/assets/svg/icon-fb.svg" alt="fb" />
          {{ typeEntry }} with Facebook
        </c-button>
        <c-button
          v-if="typeEntry === 'Sign In'"
          class="w-100 mt-20"
          tag="button"
          variant="outline-default"
          size="lg"
          @click="googleHandler"
        >
          <img svg-inline class="mr-15" src="@/assets/svg/icon-google.svg" alt="google" />
          {{ typeEntry }} with Google
        </c-button>
        <div v-if="typeEntry === 'Sign In'" class="h4 reg__or">or</div>
        <form class="form" @submit.prevent="signHandler">
          <c-form-group v-if="typeEntry === 'Sign Up'">
            <c-input
              name="firstName"
              placeholder="First Name"
              type="name"
              v-model="form.firstName"
            />
          </c-form-group>
          <c-form-group v-if="typeEntry === 'Sign Up'">
            <c-input
              name="lastName"
              placeholder="Last Name"
              type="name"
              v-model="form.lastName"
            />
          </c-form-group>
          <c-form-group>
            <c-input name="email" placeholder="Email" type="name" v-model="form.email" />
          </c-form-group>

          <c-form-group style="position: relative">
            <c-input
              name="password"
              placeholder="Password"
              :type="passwordType"
              v-model="form.pass"
            />
            <div class="password-icon">
              <div class="icon-pass">
                <img
                  svg-inline
                  src="@/assets/svg/eye.svg"
                  alt=""
                  v-if="passwordType === 'password'"
                  @click="passwordType = 'text'"
                />
              </div>
              <div class="icon-text">
                <img
                  svg-inline
                  src="@/assets/svg/eye-off.svg"
                  alt=""
                  v-if="passwordType === 'text'"
                  @click="passwordType = 'password'"
                />
              </div>
            </div>
          </c-form-group>
          <c-form-group style="position: relative" v-if="typeEntry === 'Sign Up'">
            <div class="h4 reg__promo">Promo Code</div>
            <c-input
              name="promoCode"
              placeholder="(Optional)"
              type="name"
              v-model="form.promoCode"
            />
          </c-form-group>
          <div class="reg__remember w-100" v-if="typeEntry === 'Sign In'">
            <router-link :to="{ name: 'recovery' }" class="btn-forgot ml-auto"
              >Forgot your password?</router-link
            >
          </div>
          <div class="verify-container" v-if="showRecendLink">
            <span @click="resendEmailLink">Resend activation link</span>
          </div>
          <c-button
            v-if="typeEntry === 'Sign In'"
            tag="button"
            type="submit"
            class="mt-20 btn-sign"
            variant="info"
            size="lg"
          >
            Sign In
          </c-button>
          <c-button
            v-if="typeEntry === 'Sign Up'"
            tag="button"
            type="submit"
            class="mt-5 btn-sign"
            variant="info"
            size="lg"
          >
            Sign Up
          </c-button>
        </form>
        <div class="reg__dont mt-20" v-if="isLoginPage">
          Don`t have an account?
          <router-link :to="{ name: 'SignUp' }">Sign Up</router-link>
        </div>
        <div class="reg__dont mt-20" v-else>
          Already have account?
          <router-link :to="{ name: 'SignIn' }">Sign In</router-link>
        </div>
        <br />
        <div class="text-center" v-if="typeEntry === 'Sign Up'">
          <h6>
            By clicking the "Sign Up" button, you are creating a YouToo account, and you
            agree to YouToo’s Terms of Use and Privacy Policy.
          </h6>
        </div>
      </template>
      <template v-else>
        <div class="h1">Confirmation</div>
        <div class="description account_activation">
          We have sent you a confirmation email. Please check your email and click on the
          activation link to activate your account.
        </div>
        <div class="link-container" v-if="!hideRecendLink">
          Didn’t receive the email? <span @click="resendEmailLink(true)">Resend</span>
        </div>
      </template>
    </div>
  </section>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import Vue from "vue";

export default {
  name: "signIn",
  data() {
    return {
      form: {
        email: "",
        pass: "",
        promoCode: "",
        firstName: "",
        lastName: "",
      },
      passwordType: "password",
      remember: false,
      emailSent: false,
      showRecendLink: false,
      userEmailLink: "",
      hideRecendLink: false,
    };
  },
  computed: {
    isLoginPage() {
      return this.$route.name === "SignIn";
    },
    typeEntry() {
      return this.isLoginPage ? "Sign In" : "Sign Up";
    },
  },
  methods: {
    getIdToken() {
      this.setLoadingStatus(true);
      firebase
        .auth()
        .currentUser.getIdToken() // forceRefresh
        .then((response) => {
          this.$cookies.set("userEventAppToken", response, "5d");
          this.loadCurrentUser()
            .then((response) => {
              if (response.data.emailConfirmed) {
                this.$router.push({ name: "Groups" });
              } else {
                this.emailSent = true;

                this.showRecendLink = true;
                firebase
                  .auth()
                  .signOut()
                  .then(() => {
                    Vue.$cookies.remove("userEventAppToken");
                  });
              }

              this.setLoadingStatus(false);
            })
            .catch((error) => {
              console.log("error", error.response.status);
              if (error.response.status === 403) {
                this.emailSent = true;
              }
              firebase
                .auth()
                .signOut()
                .then(() => {
                  Vue.$cookies.remove("userEventAppToken");
                });
            });
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    signHandler() {
      if (this.isLoginPage) {
        this.signIn();
      } else {
        this.signUp();
      }
    },
    signUp() {
      console.log(this.form);
      this.setLoadingStatus(true);
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.form.email, this.form.pass)
        .then(() => {
          let user = firebase.auth().currentUser;
          if (user) {
            let tmp = {
              email: this.form.email,
            };
            this.makeRequest("CREATE_USER", "POST", tmp)
              .then((response) => {
                const verifyURL = response.data.verifyUrl;

                setTimeout(() => {
                  let actionCodeSettings = {
                    url: verifyURL,
                    handleCodeInApp: true,
                  };
                  firebase
                    .auth()
                    .sendSignInLinkToEmail(tmp.email, actionCodeSettings)
                    .then(() => {
                      this.emailSent = true;
                      firebase
                        .auth()
                        .signOut()
                        .then(() => {
                          Vue.$cookies.remove("userEventAppToken");
                        });
                      window.localStorage.setItem("emailForSignIn", tmp.email);
                      this.setLoadingStatus(false);
                    })
                    .catch((error) => {
                      console.log(error);
                      this.setLoadingStatus(false);
                    });
                }, 1000);
              })
              .catch(() => {
                this.setLoadingStatus(false);
              });
          } else {
            this.$notify({
              group: "system",
              title: "Oops!",
              text: "No user defined!",
              type: "error",
            });
            this.setLoadingStatus(false);
          }
        })
        .catch((error) => {
          this.$notify({
            group: "system",
            title: "Oops!",
            text: "error: " + error,
            type: "error",
          });
          this.setLoadingStatus(false);
        });
    },
    signIn() {
      this.setLoadingStatus(true);
      firebase
        .auth()
        .signInWithEmailAndPassword(this.form.email, this.form.pass)
        .then(() => {
          let user = firebase.auth().currentUser;
          if (user) {
            this.getIdToken();
          } else {
            this.$notify({
              group: "system",
              title: "Oops!",
              text: "No user defined!",
              type: "error",
            });
          }
          this.setLoadingStatus(false);
        })
        .catch((error) => {
          this.$notify({
            group: "system",
            title: "Oops!",
            text: "error: " + error,
            type: "error",
          });
          this.setLoadingStatus(false);
        });
    },
    resendEmailLink(hideAfterSubmit = false) {
      let tmp = {
        email: this.form.email,
      };

      this.makeRequest("CREATE_USER", "POST", tmp)
        .then((response) => {
          const verifyURL = response.data.verifyUrl;

          setTimeout(() => {
            let actionCodeSettings = {
              url: verifyURL,
              handleCodeInApp: true,
            };
            firebase
              .auth()
              .sendSignInLinkToEmail(tmp.email, actionCodeSettings)
              .then(() => {
                this.emailSent = true;
                window.localStorage.setItem("emailForSignIn", tmp.email);

                if (hideAfterSubmit) {
                  this.hideRecendLink = true;
                  this.$notify({
                    group: "system",
                    title: "Awesome!",
                    text: "Activation link re-sent!",
                    type: "success",
                  });
                }

                firebase
                  .auth()
                  .signOut()
                  .then(() => {
                    Vue.$cookies.remove("userEventAppToken");
                  });

                this.setLoadingStatus(false);
              })
              .catch((error) => {
                console.log(error);
                this.setLoadingStatus(false);
              });
          }, 1000);
        })
        .catch(() => {
          this.setLoadingStatus(false);
        });
    },
    facebookHandler() {
      const providerFB = new firebase.auth.FacebookAuthProvider();
      firebase
        .auth()
        .signInWithPopup(providerFB)
        .then(() => {
          this.getIdToken();
        })
        .catch((error) => console.log("errorCode", error));
    },
    googleHandler() {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope("profile");
      provider.addScope("email");

      firebase
        .auth()
        .signInWithPopup(provider)
        .then(() => {
          this.getIdToken();
        })
        .catch((error) => console.log("errorCode", error));
    },
  },
  beforeCreate() {
    if (this.$cookies.get("userEventAppToken")) {
      this.$router.push({ name: "Main" });
    }
  },
};
</script>

<style lang="scss">
.reg {
  height: auto;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: #ececec;
  &__cont {
    height: auto;
    width: 100%;
    padding: 16px 30px 15px;
    max-width: 426px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 7px rgba(0, 0, 0, 0.12);
    background: #fff;
  }
  &__or {
    color: #95a1b6;
    margin: 20px 0;
  }
  &__promo {
    color: #95a1b6;
    margin: 2px 0px;
    margin-top: -5% !important;
  }
  &__remember {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    a {
      font-size: 14px;
      line-height: 14px;
      color: #909db1;
      text-decoration: underline;
    }
  }
  .password-icon {
    display: block;
    box-sizing: border-box;
    overflow: hidden;
    position: absolute;
    top: 60%;
    right: 22px;
    transform: translateY(-50%);
    z-index: 10;
    background: transparent;

    .icon-pass {
      svg {
        height: auto;
        width: 25px;
      }
    }
    .icon-text {
      svg {
        height: auto;
        width: 24px;
      }
    }
  }
  &__dont {
    font-size: 14px;
    line-height: 19px;
    color: #909db1;
    a {
      color: #1e86ff;
      font-weight: 500;
    }
  }
  .form {
    min-width: 95% !important;
    text-align: center !important;
    width: 100% !important;
    text-align: center !important;
  }
  .btn-sign {
    border-radius: 8px;
  }
  .btn-forgot {
    &:hover {
      color: #2889fc;
    }
  }

  .description {
    padding-top: 15px;
    color: #909db1;
  }

  .link-container {
    padding-top: 40px;
    padding-bottom: 10px;
    color: #909db1;
    text-align: center;

    span {
      color: #2889fc;
      text-decoration: underline;
      &:hover {
        text-decoration: none;
        cursor: pointer;
      }
    }
  }

  .verify-container {
    text-align: center;
    margin-top: 20px;
    padding-top: 15px;
    padding-bottom: 15px;
    background: #f7f7f7;

    span {
      cursor: pointer;
      color: #2889fc;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
.welcomeimg {
  margin-top: 6px;
  text-align: center !important;
}
section.reg1 {
  padding: 92px;
}

.reg__cont1 {
  height: auto;
  text-align: center;
  float: left;
  width: 29%;
  background: white !important;
  padding-top: 41px;
}
form {
  min-width: 95%;
  text-align: center;
}
@media only screen and (max-width: 1100px) {
  .welcomeimg {
    display: none;
  }
}
@media only screen and (max-width: 600px) {
  section.reg1 {
    padding: 0px;
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translate(0px, -50%);
  }
  .reg__cont {
    // height: auto;
    // text-align: center;
    // float: left;
    // width: 29%;
    // background: white !important;
    // padding-top: 41px;
    margin-left: 0px;
  }
}
.reg__dont.mt-20 {
  z-index: 9999;
}
</style>
