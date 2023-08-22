<template>
  <div class="recovery_wrapper">
    <div class="recovery_wrapper_body">
      <div class="recovery_wrapper_body-contents">
        <div class="header">
          <img
            class="img-logo"
            svg-inline
            src="@/assets/svg/logo.svg"
            height="100px"
            width="100px"
          />
          <h1 class="header_title">&nbsp; YouToo - Community Events</h1>
        </div>
        <div class="divider"></div>

        <div class="h3">
          Looks like you have already requested a password reset and received an email
          from us?
        </div>

        <div class="h5 gray mt-10 pb-40">
          To finish reseting your YouToo password open the reset password link from the
          email on your mobile device.
        </div>
        <div class="text-left">
          <div class="h3 gray mt-10 pb-20">
            You can reset your password in YouToo App at any time:
          </div>
          <div class="h5 gray pb-10">
            1. Enter your signin email in the App welcome screen.
          </div>
          <div class="h5 gray pb-10">
            2. Click on forgot password linnk and request a password reset email from us.
          </div>
          <div class="h5 gray pb-10">
            3. Check your inbox. If you don’t see the email within 10 minutes please check
            your spam folder.
          </div>
          <div class="h5 gray pb-10">
            4. To finish reseting your YouToo password open the reset password link from
            the email on your mobile device.
          </div>
          <br />
          <div class="h5 gray mt-10 pb-20">
            If you don't have the YouToo app installed yet, download it for your platform
            <a href="https://www.youtooapp.com/download/" target="_blank">here.</a>
          </div>
        </div>
      </div>
    </div>
    <div class="recovery__footer">
      <h6 class="footer_text">
        {{ year }} Made with
        <img
          class="footer_img"
          svg-inline
          src="@/assets/svg/heart.svg"
          height="12px"
          width="12px"
        />
        by Nisman Solutions. All rights reserved.
      </h6>
      <div class="footer_links">
        <a href="https://www.youtooapp.com/privacy-policy/">Privacy Policy</a>
        <a href="https://www.youtooapp.com/terms-of-service/" class="footer__last-link"
          >Terms of Service</a
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    year() {
      const d = new Date();
      const n = d.getFullYear();
      return n;
    },
  },
};
</script>

<style lang="scss" scoped>
.recovery_wrapper {
  margin-top: 100px;
  &_body {
    // flex items-center justify-center
    display: flex;
    align-items: center;
    justify-content: center;
    &-contents {
      width: 100%;
      padding-left: 280px;
      padding-right: 280px;
      padding-bottom: 100px;
      .header {
        display: flex;
        align-items: center;
        flex-direction: row;
        &_title {
          color: #303546;
          font-size: 40px;
          font-weight: bold;
          text-align: left;
          margin-left: 30px;
        }
      }
      .divider {
        margin-top: 30px;
        background: #9fa5b0;
        height: 1px;
        margin-bottom: 46px;
      }
    }
  }
  .recovery__footer {
    // make hidden in mobile hidden
    width: 100%;
    display: flex;
    background-color: #8eaacc;
    height: 48px;
    justify-content: space-between;
    align-items: center;
    padding: 0px 120px;
    position: fixed;
    bottom: 0px;
    color: white;
    .footer_text {
      display: flex;
      align-items: center;
      font-size: 18px;
      font-weight: normal;
      .footer_img {
        margin: 0px 5px;
      }
    }
    .footer_links {
      display: flex;
      align-items: center;
      font-size: 18px;
      color: white;
      a {
        color: white;
        text-decoration: none;
      }
      .footer__last-link {
        margin-left: 5px;
      }
    }
  }
}
@media (max-width: 1024px) {
  .recovery_wrapper {
    &_body {
      &-contents {
        width: 100%;
        padding-left: 100px;
        padding-right: 100px;
        padding-bottom: 100px;
      }
    }
  }
  .recovery__footer {
    display: none !important;
  }
}
@media (max-width: 768px) {
  .recovery_wrapper {
    &_body {
      &-contents {
        width: 100%;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 100px;
        .header {
          display: flex;
          align-items: center;
          flex-direction: column;
          &_title {
            color: #303546;
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            margin-left: 0px;
          }
        }
      }
    }
  }
  .recovery__footer {
    display: none !important;
  }
}
</style>
