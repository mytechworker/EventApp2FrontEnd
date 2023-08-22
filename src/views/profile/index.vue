<template>
  <div class="user-profile">
    <div class="h1 mb-30">User profile</div>
    <div class="user-profile__content">
      <div class="user-profile__image">
        <c-image-upload @ready="uploadUserPhoto" />
        <template v-if="model.photo">
          <img :src="model.photo.url" alt="" />
        </template>
      </div>
      <div class="user-profile__fields">
        <c-input v-model="model.firstName" placeholder="First name" class="mb-15" />
        <c-input v-model="model.lastName" placeholder="Last name" class="mb-15" />
        <c-input v-model="model.email" placeholder="Email" class="mb-15" />
        <div class="d-flex align-center justify-content-between">
          <div class="d-flex align-center">
            <c-button
              tag="button"
              size="sm"
              variant="info"
              class="btn-save foot"
              @click="save"
            >
              Save
            </c-button>
            <c-button
              tag="button"
              size="sm"
              variant="info"
              @click="handleZoomClick"
              class="button-zoom pc"
              :class="{ activated: model.isZoomAuthorized }"
            >
              <img svg-inline src="@/assets/svg/icon-zoom.svg" />
              <template v-if="!model.isZoomAuthorized">
                <span>Connect Zoom</span>
              </template>
              <template v-else>
                <span class="zoom-connected">Zoom Connected</span>
                <span class="zoom-connected">Disconnect Zoom</span>
              </template>
            </c-button>
          </div>
          <!-- <c-button
            tag="button"
            size="sm"
            variant="outline-warning"
            @click="deleteAccount"
            class="btn-delete"
          >
            Delete Account
          </c-button> -->
        </div>
      </div>
      <div class="linksBlocks">
        <div class="linksBlocks__card">
          <div class="apps">
            <span class="apps__title">Member apps</span>
            <img class="apps__icon" src="@/assets/svg/apple-blue.svg" alt="" />
            <img class="apps__icon" src="@/assets/svg/android-blue.svg" alt="" />
          </div>
          <c-button
            :href="linkDownloads"
            target="_blank"
            tag="a"
            size="sm"
            variant="info"
            class="btn-save"
          >
            downloads
          </c-button>
        </div>
        <div class="linksBlocks__card">
          <div class="chat">
            <div class="help_avater">
              <img src="@/assets/img/chat-avatar.png" alt="" />
              <div class="online_wrapper">
                <div class=""></div>
              </div>
            </div>
            <div>
              <p class="chat__title">Need help?</p>
              <p class="chat__text p-0">I’m here for you.</p>
            </div>
          </div>
          <c-button
            :href="linkLetsChat"
            target="_blank"
            tag="a"
            size="sm"
            variant="info"
            class="btn-save"
          >
            Let’s chat
          </c-button>
        </div>
      </div>
    </div>
    <div class="bottom_nav">
      <div class="cancel" @click="$router.push({ name: `Groups` })">cancel</div>
      <div @click="save" class="save">Save</div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import urls from "@/common/urls";
export default {
  components: {
    "c-image-upload": () => import("@/components/image-upload"),
  },
  data() {
    return {
      model: {
        firstName: "",
        lastName: "",
        email: "",
        photo: {
          url: "",
        },
        isZoomAuthorized: false,
      },
      userID: 0,
      uid: "",
      linkLetsChat: urls.LINK_LETS_CHAT,
      linkDownloads: urls.LINK_DOWNLOADS,
    };
  },
  methods: {
    save() {
      var user = this.getCurrentUser;
      user.firstName = this.model.firstName;
      user.lastName = this.model.lastName;
      user.email = this.model.email;
      this.setLoadingStatus(true);
      this.makeRequest("USER_INFO_UPDATE", "PUT", user).then((data) => {
        console.log("save data", data);
        if (data.status === 200) {
          this.setLoadingStatus(false);
          this.$notify({
            group: "system",
            title: "Great!",
            text: "User information has been changed!",
            type: "success",
          });
          this.loadCurrentUser().then((data) => {
            console.log("save loadCurrentUser", data);
            this.model = { ...this.getCurrentUser };
          });
        }
      });
    },
    uploadUserPhoto(img) {
      this.uploadImg(`/user/photo`, img);
    },
    zoomAuth() {
      this.setLoadingStatus(true);
      this.makeRequest("ZOOM_AUTH", "GET").then((data) => {
        if (data.status === 200) {
          this.setLoadingStatus(false);
          // this.model.isZoomAuthorized = true;
          window.open(data.data, "_blank");
        }
      });
    },
    zoomDeAuth() {
      this.$confirm({
        title: "Are you sure?",
        message: `You want to disconnect zoom!`,
        button: {
          no: "cancel",
          yes: "Disconnect",
        },
        callback: (confirm) => {
          if (confirm) {
            this.setLoadingStatus(true);
            this.makeRequest("ZOOM_DE_AUTH", "GET").then((data) => {
              if (data.status === 200) {
                this.setLoadingStatus(false);
                // this.model.isZoomAuthorized = false;
                window.open(data.data, "_blank");
              }
            });
          }
        },
      });
    },
    handleZoomClick() {
      this.model.isZoomAuthorized ? this.zoomDeAuth() : this.zoomAuth();
    },
    createMeeting() {
      this.makeRequest("MEETING_CREATE", "POST", null, 1).then((data) => {
        if (data.status === 200) {
          this.setLoadingStatus(false);
          this.$notify({
            group: "system",
            title: "Great!",
            text: "Zoom meeting created!",
            type: "success",
          });
        }
      });
    },
    deleteAccount() {
      const id = this.userID;
      this.$confirm({
        title: "Are you sure?",
        message: `You want to delete your account!`,
        button: {
          no: "no",
          yes: "Delete",
        },
        callback: (confirm) => {
          if (confirm) {
            let url = ["API_USER_DELETE", id];
            this.makeRequest(url, "DELETE", null, id).then((res) => {
              if (res.status === 200) {
                firebase.auth().currentUser.delete();
                this.$store.dispatch("userLogout");
              }
            });
          }
        },
      });
    },
  },
  mounted() {
    const user = this.getCurrentUser;
    if (user.id) {
      this.model = { ...this.getCurrentUser };
      this.userID = user.id;
    } else {
      this.loadCurrentUser().then((response) => {
        if (response && response.status === 200) {
          this.model = { ...response.data };
          this.userID = response.data.id;
        }
      });
    }

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid;
      }
    });
  },
};
</script>

<style lang="scss">
@import "./../../style/_profile.scss";
.linksBlocks__card {
  margin-left: 5px;
}
.help_avater {
  position: relative;
  width: 40px;
  height: 40px;
  margin-right: 16px;
  .online_wrapper {
    width: 12px;
    height: 12px;
    background-color: white;
    border-radius: 100%;
    position: absolute;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    right: 0;
    bottom: 0;
    div {
      width: 8px;
      height: 8px;
      border-radius: 100%;
      background: #2bbe75;
    }
  }
}
//  bg-white px-[16px]
.bottom_nav {
  display: none;
}
@media (max-width: 1024px) {
  .user-profile .apps {
    margin-bottom: 19px;
  }
  .user-profile .user-profile__content .linksBlocks {
    display: flex;
  }
  .bottom_nav {
    z-index: 10;
    background-color: #fff;
    display: flex;
    align-items: center;
    width: 100%;
    margin-top: 123px;
    .save {
      padding: 11px 35px;
      width: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #2889fc;
      border-radius: 3px;
      color: #fff;
      margin-left: 11px;
      cursor: pointer;
    }
    .cancel {
      padding: 11px 35px;
      width: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      border: #2889fc;
      border-style: solid;
      border-width: 1px;
      border-radius: 3px;
      color: #2889fc;
      cursor: pointer;
    }
  }
}
</style>
