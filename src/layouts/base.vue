<template>
  <div class="c-base">
    <div class="c-base__right w-100">
      <div
        class="c-base__header"
        :class="{ 'has-back-link': getGroup && getGroup.title }"
      >
        <div class="c-base__logo">
          <router-link :to="{ name: 'Groups' }">
            <img src="@/assets/logo.svg" alt="logo" />
          </router-link>
        </div>
        <template v-if="getGroup && $route.name!='Groups'">
          <div class="c-base__back" @click="back()">
            <img src="@/assets/svg/back.svg" alt="Back" class="mr-15" />
            back
          </div>
          <div class="c-base__breadcrumbs">{{ getGroup.title }}
          </div>
        </template>
        <div class="c-base__notifications">
          <div>
            <div v-if="NewNotifications > 0" @click="openNotifications()">
              <img src="@/assets/svg/icon-notification.svg" alt="Back" />
              <span class="notifications-counter" v-if="NewNotifications < 100"> {{ NewNotifications }}</span>
			  <span class="notifications-counter max" v-else>99</span>
            </div>
            <img
              v-else
              src="@/assets/svg/icon-notification-empty.svg"
              @click="openNotifications()"
              alt="Back"
            />
          </div>
        </div>
        <div class="c-base__user">
          <c-button
            class="c-base__user-title"
            variant="plain"
            :to="{ name: 'Profile' }"
          >
            <span class="user-photo">
              <template v-if="getCurrentUser.photo">
                <img :src="getCurrentUser.photo.url" alt="user photo" />
              </template>
            </span>
            <span class="user-name">
              <template
                v-if="getCurrentUser.firstName && getCurrentUser.lastName"
              >
                {{ getCurrentUser.firstName }} {{ getCurrentUser.lastName }}
              </template>
              <template v-else>
                {{ getCurrentUser.userName }}
              </template>
            </span>
          </c-button>
          <c-button class="c-base__user-dropdown" variant="plain">
            <img svg-inline src="@/assets/svg/icon-down.svg" />
          </c-button>
          <div class="c-base__user-nav">
            <div class="c-base__user-nav-container">
              <c-button
                class="c-base__user-nav-container-item"
                variant="plain"
                :to="{ name: 'Profile' }"
              >
                <div class="icon mr-15">
                  <img svg-inline src="@/assets/svg/icon-settings.svg" />
                </div>
                Account
              </c-button>
              <c-button
                class="c-base__user-nav-container-item item-logout"
                tag="button"
                variant="plain"
                @click="logout"
              >
                <div class="icon mr-15">
                  <img svg-inline src="@/assets/svg/icon-logout.svg" />
                </div>
                Sign Out
              </c-button>
            </div>
          </div>
        </div>
      </div>

      <div class="c-base__right-content">
        <slot />
      </div>
    </div>

    <!--MODALS-->

    <transition name="fade" mode="out-in">
      <c-modal
        v-if="getActiveModal"
        @outside="$store.dispatch('setActiveModal', null)"
      >
        <c-event-modal v-if="getActiveModal === 'event'" />
        <c-group-modal v-if="getActiveModal === 'group'" />
        <c-group-user-modal admin v-if="getActiveModal === 'groupAdmin'" />
        <c-group-user-modal v-if="getActiveModal === 'groupMember'" />
        <c-download-modal v-if="getActiveModal === 'download'" />
        <c-post-modal v-if="getActiveModal === 'post'" />
      </c-modal>
    </transition>
    <!--Sidebars-->
    <c-notifications v-if="getActiveSidebar === 'notifications'" />
  </div>
</template>
<script>
export default {
  components: {
    "c-modal": () => import("@/components/modals"),
    "c-event-modal": () => import("@/components/modals/newEvent"),
    "c-group-modal": () => import("@/components/modals/newGroup"),
    "c-group-user-modal": () => import("@/components/modals/newGroupAdmin"),
    "c-download-modal": () => import("@/components/modals/downloadFile"),
    "c-post-modal": () => import("@/components/modals/newPost"),
    "c-notifications": () => import("@/components/notifications"),
  },
  data() {
    return {
      minimized: false,
    };
  },
  methods: {
    logout() {
      this.$store.dispatch("userLogout");
    },
    async openNotifications() {
      await this.loadNotifications();
      await this.loadCurrentUser();
      this.$store.dispatch("setActiveSidebar", "notifications");
      this.$store.commit("setNewNotifications", 0);
    },
    // GetNoNReedNotif() {
    //   const result = this.getNotifications.filter((item) => !item.isSeen);
    //   return result.length;

    // },
    back(){
      if(this.$route.name=="GroupSingle"){
        this.$router.push({ name: `Groups` })
      }else{
      this.$router.go(-1)
      }
    }
  },
  beforeMount() {

     

    //const result = this.getNotifications.filter((item) => !item.isSeen);
    //this.$store.commit("setNewNotifications", result.length);
  },

  computed:{
     NewNotifications () {
      return this.$store.getters.getNewNotifications
    }
  },
  beforeDestroy() {
   this.$store.dispatch("setActiveSidebar", null); 
	}
};
</script>


<style lang="scss" scoped>
@import "./../style/_layout-base.scss";
</style>
