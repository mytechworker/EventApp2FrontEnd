<template>
  <div
    class="notification"
    :class="{ 'not-read': !item.isSeen }"
    @click="openNotification()"
  >
    <div class="notification__image" :class="{ circle: circle }">
      <img v-if="largeImage" :src="largeImage" alt="" />
      <p v-else-if="isPost && circle" class="notification__name">
        {{ item.userFirstName[0] }}{{ item.userLastName[0] }}
      </p>
      <div v-else-if="isPost"></div>
      <div class="bgEventDate" v-else-if="curentEventStartdate && !circle">
        <h5>{{ months[curentEventStartdate.getMonth()] }}</h5>
        <p>{{ curentEventStartdate.getDate() }}</p>
        <img src="@/assets/svg/bg-event-date.svg" alt="" />
      </div>
      <p
        v-else-if="circle && (item.userFirstName || item.userLastName)"
        class="notification__name"
      >
        {{ item.userFirstName[0] }}{{ item.userLastName[0] }}
      </p>
    </div>
    <div v-if="smallImage" class="notification__imageSmall">
      <img :src="smallImage" alt="" />
    </div>
    <!-- {{item.id}} -->
    <div class="notification__text">
      <p class="title">{{ item.title }}</p>
      <div class="notification__info">
        <span class="notification__time">{{ time }}</span>
        <span class="name" v-if="item.content.length > 0">"{{ item.content }}"</span>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  data() {
    return {
      time: "0m",
      circle: false,
      largeImage: null,
      smallImage: null,
      curentEventStartdate: null,
      isPost: false,
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    };
  },
  methods: {
    async openNotification() {
      await this.loadGroup(this.item.groupId);
      if (!this.item.isSeen) this.readNotification();
      console.log("imp>>>>", !this.isMember());
      if (!this.isMember()) {
        Vue.notify({
          group: "system",
          title: "Oops!",
          text: "group is unavailable",
          type: "error",
        });
        return;
      }

      if (this.item.postId) {
        await this.loadPost(this.item.postId);
        let post = this.$store.getters.getPost;
        await this.setActivePage("Posts");
        this.$router.push({ path: `/groups/${post.groupId}` });
        this.$store.dispatch("setCurrentPost", post);
        this.$store.dispatch("setActiveModal", "post");
      } else if (this.item.eventId) {
        await this.loadEvent(this.item.eventId);
        let event = this.$store.getters.getEvent;
        await this.setActivePage("Events");
        this.$router.push({ path: `/groups/${event.groupId}` });
        this.$store.dispatch("setCurrentEvent", event);
        this.$store.dispatch("setActiveModal", "event");
      } else {
        await this.setActivePage("Members");
        this.$router.push({ path: `/groups/${this.item.groupId}` });
      }
    },
    isMember() {
      const users = this.getGroup.users;
      if (!users) return false;
      return users.find((item) => item.email == this.getCurrentUser.email);
    },
    readNotification() {
      const url = "READ_NOTIFICATION";
      const method = "POST";
      this.makeRequest(url, method, [this.item.id]).then((res) => {
        if (res.status == 200) {
          console.log("notification has been read!");
          this.$emit("readNotif", this.item.id);
        }
      });
    },
    getEventStartdate() {
      let dateTimezone = new Date().getTimezoneOffset() * 60 * 1000;
      let eventStartdate = new Date(this.item.entityDateTime);
      this.curentEventStartdate = new Date(+eventStartdate - dateTimezone);
    },
    getPostCreatedTime() {
      let dateNow = new Date();
      let date = new Date(this.item.createdOnUtc);
      dateNow = +dateNow + 60 * 1000;
      this.time = ((+dateNow - date) / 1000 / 60).toFixed();
      if (this.time > 60 * 24) {
        this.time = (this.time / 60 / 24).toFixed() + "d";
      } else if (this.time > 60) {
        this.time = (this.time / 60).toFixed() + "h";
      } else if (this.time == 0) {
        this.time = "now";
      } else {
        this.time += "m";
      }
    },
    imageUrl() {
      this.largeImage = this.item.largeImageUrl;
      this.smallImage = this.item.smallImageUrl;
    },
    updateNotification() {
      this.getPostCreatedTime();
      switch (this.item.type) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          this.circle = true;
          this.imageUrl();
          break;
        case 21:
        case 22:
        case 23:
        case 24:
        case 25:
        case 26:
        case 27:
          this.getEventStartdate();
          this.imageUrl();
          this.circle = true;
          //
          break;
        case 28:
        case 29:
        case 31:
        case 32:
        case 33:
        case 34:
        case 35:
        case 36:
          this.imageUrl();
          this.isPost = true;
          this.circle = true;
          break;
        case 37:
          this.imageUrl();
          this.isPost = true;
          break;
        case 41:
          if (this.item.title == "Your question on test was answered") {
            this.getEventStartdate();
            this.imageUrl();
          } else {
            this.circle = true;
            this.imageUrl();
          }
          break;
        case 42:
        case 43:
          this.getEventStartdate();
          this.imageUrl();
          this.item.content = "";
          break;
        case 44:
          this.imageUrl();
          break;
        case 52:
        case 53:
          this.getEventStartdate();
          this.imageUrl();
          break;
        default: {
          (this.circle = false), this.imageUrl();
        }
      }
    },
  },
  props: {
    item: {
      type: Object,
      default: null,
    },
  },
  watch: {
    item() {
      this.updateNotification();
    },
  },
  created() {
    this.updateNotification();
  },
  beforeDestroy() {
    window.removeEventListener("keyup", this.handler);
  },
};
</script>
