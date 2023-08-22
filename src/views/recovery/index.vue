<template>
  <section class="forgot">
    <div class="forgot__cont">
      <back rout-name="SignIn"> Back to sign in </back>
      <div class="h1 mt-20">Forgot your password?</div>
      <div class="h5 gray mt-10">
        If you lost your password, insert your username or your email address in the field
        below. You will receice a message with instructions.
      </div>

      <form @submit.prevent="send()">
        <c-input
          v-model="model.email"
          placeholder="Type in your email"
          class="w-100 mt-20"
        />
        <div class="forgot__controls mt-20">
          <c-button class="btn-send" tag="button" variant="info" size="lg">
            Send message
          </c-button>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
import Back from "../../components/button/back";
import firebase from "firebase/app";
import urls from "../../common/urls";

export default {
  name: "index",
  components: { Back },
  data() {
    return {
      model: {
        email: "",
        userId: "",
      },
      sentEmail: false,
    };
  },
  methods: {
    send() {
      console.log("send", this.model.email, urls.URL_SIGNIN);
      var actionCodeSettings = { url: urls.URL_SIGNIN };
      firebase
        .auth()
        .sendPasswordResetEmail(this.model.email, actionCodeSettings)
        .then(() => {
          console.log("send sendPasswordResetEmail ok");
          this.$notify({
            group: "system",
            title: "Great!",
            text: "Password reset email sent!",
            type: "success",
          });
          this.sentEmail = true;
          this.setLoadingStatus(false);
        })
        .catch((error) => {
          console.log("send sendPasswordResetEmail", error);
          this.$notify({
            group: "system",
            title: "Oops!",
            text: "error: " + error,
            type: "error",
          });
          this.setLoadingStatus(false);
        });
    },
  },
};
</script>

<style lang="scss">
@import "./../../style/_recovery.scss";
.forgot {
  height: auto;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 20%;

  background: #fff;
}
.img-logo {
  vertical-align: middle;
  padding-right: 30px;
}
.forgot__cont {
  // align-items: center !important;
}
.right {
  float: right;
}
hr {
  background: black !important;
  height: 2px;
  width: 80%;
}
.footer {
  width: 100%;
  background: #8eaacc;
  color: white;
  padding: 5px;
}
@media only screen and (max-width: 600px) {
  .forgot__cont {
    align-items: flex-start !important;
  }
  .forgot {
    padding: 10px 1%;
    background: #fff;
  }
  .img-logo {
    padding: 0%;
    float: left;
    width: 100%;
  }
  .footer {
    display: none;
  }
}
</style>
