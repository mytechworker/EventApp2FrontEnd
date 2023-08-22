<template>
  <div class="group-single" v-if="getGroup">
    <div
      class="group-single__content"
      :class="{
        'group-single__content--minimized-info': minimizedInfo && !isActiveSidebar,
      }"
    >
      <div class="group-single__headline" v-if="isGroupAdmin || isSystemAdmin">
        <div class="group-single__nav">
          <c-button
            tag="button"
            :class="{ active: type === 'Events' }"
            variant="plain"
            @click="type = 'Events'"
          >
            Events
          </c-button>
          <c-button
            tag="button"
            :class="{ active: type === 'Posts' }"
            variant="plain"
            @click="type = 'Posts'"
          >
            Posts
          </c-button>
          <c-button
            tag="button"
            :class="{ active: type === 'Members' }"
            variant="plain"
            @click="type = 'Members'"
          >
            Members
          </c-button>
          <c-button
            tag="button"
            :class="{ active: type === 'Social requests' }"
            variant="plain"
            style="display: none"
          >
            Social requests
          </c-button>
        </div>
      </div>

      <Events
        :tablesPaginationEnable="tablesPaginationEnable"
        :showPreload="showPreload"
        :rowsEvents="rowsEvents"
        class="table-container"
        :class="{ active: type === 'Events' }"
        :isGroupAdmin="isGroupAdmin"
        :isSystemAdmin="isSystemAdmin"
        @minimizedInfo="
          () => {
            minimizedInfo = !minimizedInfo;
          }
        "
      />
      <Members
        :showPreload="showPreload"
        :rowsMembers="rowsMembers"
        :isGroupAdmin="isGroupAdmin"
        :isSystemAdmin="isSystemAdmin"
        class="table-container"
        :class="{ active: type === 'Members' }"
        @minimizedInfo="
          () => {
            minimizedInfo = !minimizedInfo;
          }
        "
      />
      <Posts
        :rowsPosts="rowsPosts"
        :showPreload="showPreload"
        :isGroupAdmin="isGroupAdmin"
        :isSystemAdmin="isSystemAdmin"
        class="table-container"
        :class="{ active: type === 'Posts' }"
        @minimizedInfo="
          () => {
            minimizedInfo = !minimizedInfo;
          }
        "
      />
    </div>

    <div v-if="!isEdit && joinCodeActive && showQR" class="modal-qr-code">
      <div class="modal-qr-code__container">
        <div class="h1">{{ getGroup.title }}</div>
        <p>
          This scannable code is a link to join {{ getGroup.title }}.
          <span
            class="icon-help"
            v-tooltip="{
              content:
                '<strong>Tip:</strong> Click Download. <br>You can also right-click <br>the code image and <br>select Save or Copy.',
              html: true,
            }"
          >
            <img svg-inline src="@/assets/svg/icon-info.svg" />
          </span>
        </p>
        <div class="modal-qr-code__container-qr">
          <qrcode-vue
            :value="joinUrlInner"
            :size="250"
            level="H"
            class="qr-code-canvas"
          />
        </div>
        <div class="modal-qr-code__container-actions">
          <span class="btn-cancel" @click="showQR = false"> Cancel </span>
          <c-button
            variant="info"
            size="sm"
            tag="button"
            class="btn-save"
            @click="saveQR"
          >
            Download
          </c-button>
        </div>
      </div>
    </div>
    <div v-if="showDescription" class="modal-qr-code modal-description">
      <div class="modal-qr-code__container">
        <div class="h1">{{ getGroup.title }}</div>
        <div class="modal-qr-code__description">
          {{ getGroup.description }}
        </div>
        <div class="modal-qr-code__container-actions">
          <span class="btn-cancel" @click="showDescription = false"> Close </span>
        </div>
      </div>
    </div>

    <div
      class="group-single__info"
      v-if="getGroup && !isActiveSidebar"
      :class="{ 'group-single__info--minimized-info': minimizedInfo }"
    >
      <div class="group-single__info-container">
        <!--TITLE-->
        <div class="group-single__info-headline">
          <c-input v-model="editModel.title" v-if="isEdit" />
          <span v-else>{{ getGroup.title }}</span>
          <div class="collapse-toggle" @click="minimizedInfo = !minimizedInfo">
            <img svg-inline src="@/assets/svg/info-toggle.svg" width="30" />
          </div>
        </div>

        <!--IMAGE-->
        <div class="group-single__info-image">
          <img :src="getGroup.photo.url" v-if="getGroup.photo" />
          <img src="@/assets/img/group.png" v-if="!getGroup.photo" />
          <div class="imageUploadBlock">
            <c-image-upload @ready="uploadGroupPhoto" v-if="isEdit" />
          </div>
        </div>

        <!--DETAILS-->
        <div class="group-single__info-details" :class="{ 'details-edit': isEdit }">
          <div class="field-row" style="flex-direction: column">
            <label class="mb-10" v-if="isEdit"> Group description </label>
            <div>
              <c-textarea v-model="editModel.description" v-if="isEdit" />
              <span class="group-description" v-else>
                <template v-if="getGroup.description">
                  <template v-if="getGroup.description.length > 300">
                    {{ getGroup.description.slice(0, 200) + " ..." }}
                    <span class="read-more" @click="showDescription = true"
                      >Read More</span
                    >
                  </template>
                  <template v-else>
                    {{ getGroup.description }}
                  </template>
                </template>
                <template v-else> - </template>
              </span>
            </div>
          </div>

          <c-button
            variant="info"
            size="sm"
            tag="button"
            class="px-15 button-edit"
            @click="showEdit"
            v-if="!isEdit && (isGroupAdmin || isSystemAdmin)"
          >
            EDIT
          </c-button>
        </div>

        <!--SHARE LINK-->
        <div class="group-single__info-share">
          <div class="group-single__info-share__title" v-if="isEdit || joinCodeActive">
            <div
              class="col"
              v-tooltip="{
                content:
                  '<strong>Note:</strong> Anyone who has access <br>to this link will be able to join <br>your group.' +
                  '<br><br><strong>TIp:</strong> Don’t share this link <br>publicly. Share the link directly <br>with the people you want to <br>join your group.',
                html: true,
                trigger: 'hover click',
              }"
            >
              Public join link
              <img svg-inline src="@/assets/svg/icon-info.svg" />
            </div>
            <div class="col" v-if="isEdit">
              <div
                class="custom-switch"
                @click="toggleJoinLink"
                :class="{ 'is-active': joinCodeActive }"
              ></div>
            </div>
          </div>
          <div
            class="group-single__info-share__input"
            v-if="joinCodeActive && joinUrlInner"
          >
            <span>{{ joinUrlInner ? joinUrlInner : "" }}</span>
            <div class="btn-copy" @click="copyJoinUrl">
              <img svg-inline src="@/assets/svg/icon-duplicate.svg" />
            </div>
          </div>
          <div class="group-single__info-share__actions">
            <template v-if="!isEdit && joinCodeActive">
              <span class="bnt-join-action" @click="copyJoinUrl">
                <span class="icon">
                  <img svg-inline src="@/assets/svg/icon-copy-blue.svg" />
                </span>
                <span class="title">Copy</span>
              </span>
              <span class="bnt-join-action" style="display: none">
                <span class="icon">
                  <img svg-inline src="@/assets/svg/icon-share.svg" />
                </span>
                <span class="title">Share</span>
              </span>
              <span class="bnt-join-action" @click="showQR = true">
                <span class="icon">
                  <img svg-inline src="@/assets/svg/icon-qr.svg" />
                </span>
                <span class="title">QR code</span>
              </span>
              <a :href="joinUrlInner" target="_blank" class="bnt-join-action">
                <span class="icon">
                  <img svg-inline src="@/assets/svg/icon-eye.svg" />
                </span>
                <span class="title">Visit</span>
              </a>
            </template>
            <span
              v-if="isEdit && joinCodeActive && joinUrlInner"
              class="bnt-join-action"
              @click="generateJoinLink"
            >
              <span class="icon">
                <img svg-inline src="@/assets/svg/icon-reload.svg" />
              </span>
              <span class="title">Regenerate</span>
            </span>
          </div>
        </div>

        <!--CANCEL / SAVE-->
        <div class="edit-control-buttons" v-if="isEdit">
          <c-button size="sm" tag="button" @click="clearModel" variant="outline-info">
            Cancel
          </c-button>
          <c-button size="sm" tag="button" @click="updateGroup" variant="info">
            Save
          </c-button>
        </div>

        <!--DELETE-->
        <div class="group-single__info-delete" v-if="isEdit">
          <div class="button" @click="removeGroup(getGroup.id, getGroup.title)">
            <img
              svg-inline
              src="@/assets/svg/icon-delete.svg"
              height="21px"
              width="21px"
            />
            <span>Delete group</span>
          </div>
        </div>
      </div>
      <div class="group-single__info-top-actions" @click="minimizedInfo = !minimizedInfo">
        <img svg-inline src="@/assets/svg/info-toggle.svg" width="30" />
      </div>
      <div class="group-single__info-toggle" @click="minimizedInfo = !minimizedInfo">
        <img svg-inline src="@/assets/svg/sidebar-arrows.svg" />
      </div>
    </div>
  </div>
</template>

<script>
import QrcodeVue from "qrcode.vue";
import "vue-good-table/dist/vue-good-table.css";
import { saveAs } from "file-saver";
// eslint-disable-next-line no-unused-vars
import { toBlob } from "blueimp-canvas-to-blob";

export default {
  components: {
    "qrcode-vue": QrcodeVue,
    "c-image-upload": () => import("@/components/image-upload"),

    Events: () => import("./Events.vue"),
    Members: () => import("./Members.vue"),
    Posts: () => import("./Posts.vue"),
  },
  data() {
    return {
      isEdit: false,
      editModel: null,
      rowsEvents: [],
      rowsMembers: [],
      rowsPosts: [],
      showPreload: true,
      windowWidth: window.innerWidth,
      tablesPaginationEnable: true,
      joinCodeActive: false,
      joinUrlInner: null,
      showQR: false,
      showDescription: false,
    };
  },
  methods: {
    updateGroup() {
      if (this.joinCodeActive && !this.editModel.joinCodeEnabled) {
        let url = ["GROUP_JOIN_CODE_ADD_BY_ID", this.getGroup.id];
        this.setLoadingStatus(true);
        this.makeRequest(url, "POST", null, this.getGroup.id).then((res) => {
          this.setLoadingStatus(false);
          if (res.status === 200) {
            this.editModel.joinCodeEnabled = true;
            this.syncGroupWithModel();
          }
        });
      } else if (!this.joinCodeActive && this.editModel.joinCodeEnabled) {
        this.editModel.joinUrl = null;
        this.editModel.joinCode = null;

        let url = ["GROUP_JOIN_CODE_REMOVE_BY_ID", this.getGroup.id];
        this.setLoadingStatus(false);
        this.makeRequest(url, "POST", null, this.getGroup.id).then((res) => {
          this.setLoadingStatus(false);
          if (res.status === 200) {
            this.editModel.joinCodeEnabled = false;
            this.syncGroupWithModel();
          }
        });
      } else {
        this.syncGroupWithModel();
      }
    },
    syncGroupWithModel() {
      this.setLoadingStatus(true);
      this.makeRequest("GROUP_UPDATE", "PUT", this.editModel).then((res) => {
        this.setLoadingStatus(false);
        if (res.status === 200) {
          this.clearModel();
          this.loadGroup(this.$route.params.id);
          this.$notify({
            group: "system",
            title: "Great!",
            text: "Group information has been changed!",
            type: "success",
          });
        }
      });
    },
    showEdit() {
      this.editModel = { ...this.getGroup };
      this.isEdit = true;
    },
    clearModel() {
      this.isEdit = false;
      this.editModel = { ...this.getGroup };
    },
    uploadGroupPhoto(img) {
      const url = `/group/${this.getGroup.id}/photo`;
      this.uploadImg(url, img).then((response) => {
        if (response && response.status === 200) {
          console.log("uploadGroupPhoto", response.data);
          this.loadGroup(this.$route.params.id);
        }
      });
    },

    removeGroup(id, title) {
      this.$confirm({
        title: "Are you sure?",
        message: `You want to delete ${title} group!`,
        button: {
          no: "Cancel",
          yes: "Delete",
        },
        callback: (confirm) => {
          if (confirm) {
            this.setLoadingStatus(true);
            this.makeRequest("DELETE_GROUP", "DELETE", null, id).then((res) => {
              this.setLoadingStatus(false);
              if (res.status === 200) this.$router.push({ name: "Groups" });
              this.$notify({
                group: "system",
                title: "Great!",
                text: "Group has been removed!",
                type: "warning",
              });
              this.$store.dispatch("searchGroup");
            });
          }
        },
      });
    },
    // handleResize() {
    //   this.windowWidth = window.innerWidth;
    //   if (this.windowWidth > 767) {
    //     this.tablesPaginationEnable = true;
    //   }
    // },
    copyJoinUrl() {
      navigator.clipboard.writeText(this.joinUrlInner);
      this.$notify({
        group: "system",
        title: "Great!",
        text: "Link copied successfully!",
        type: "success",
      });
    },
    generateJoinLink() {
      this.setGenerateJoinLinkModalStatus(true);
      this.$confirm({
        title: "Confirmation",
        message: `The old link will no longer work. There is no undo. Make sure to send the new link to anyone who needs to join. Go ahead? `,
        button: {
          no: "Cancel",
          yes: "GENERATE NEW LINK",
        },
        callback: (confirm) => {
          if (confirm) {
            let url = ["GROUP_JOIN_CODE_ADD_BY_ID", this.getGroup.id];
            this.setLoadingStatus(true);
            this.makeRequest(url, "POST", null, this.getGroup.id).then((res) => {
              this.setLoadingStatus(false);
              if (res.status === 200) {
                this.$notify({
                  group: "system",
                  title: "Great!",
                  text: "Invite link successfully regenerated!",
                  type: "success",
                });

                this.editModel.joinCodeEnabled = true;
                this.makeRequest("GROUP_UPDATE", "PUT", this.editModel).then((res) => {
                  if (res.status === 200) {
                    console.log("group updated");
                    this.joinCodeActive = true;
                    this.joinUrlInner = res.data.joinUrl;
                  }
                });
              }
            });
          }
          this.setGenerateJoinLinkModalStatus(false);
        },
      });
    },
    toggleJoinLink() {
      if (!this.joinCodeActive) {
        this.$notify({
          group: "system",
          title: "Great!",
          text: "Save the changes for the link to be generated and showed on the screen.",
          type: "warn",
        });
        this.joinCodeActive = true;
      } else {
        this.setGenerateJoinLinkModalStatus(true);
        this.$confirm({
          title: "Confirmation",
          message: `The link will no longer work. There is no undo. Go ahead? `,
          button: {
            no: "Cancel",
            yes: "DISABLE LINK",
          },
          callback: (confirm) => {
            if (confirm) {
              this.joinCodeActive = false;
              this.$notify({
                group: "system",
                title: "Great!",
                text: "Save the changes for the link to be disabled.",
                type: "warn",
              });
            }
            this.setGenerateJoinLinkModalStatus(false);
          },
        });
      }
    },
    saveQR() {
      const canvas = document.getElementsByTagName("canvas")[0];
      const filename = this.getGroup.title.replace(/ /g, "-") + "-join-qr.png";
      canvas.toBlob(function (blob) {
        saveAs(blob, filename);
      });
    },
  },
  computed: {
    isGroupAdmin() {
      return (
        this.getGroup.users &&
        this.getGroup.users.some(
          (user) => user.id === this.getCurrentUser.id && user.isAdmin
        )
      );
    },
    isSystemAdmin() {
      return this.getCurrentUser.isSystemAdmin;
    },
    type: {
      get() {
        return this.getActivePage;
      },
      set(v) {
        this.setActivePage(v);
      },
    },
    isActiveSidebar() {
      return !!this.$store.getters.getActiveSidebar;
    },
    minimizedInfo: {
      get() {
        return this.$store.getters.getMinimizedInfo;
      },
      set(v) {
        this.$store.commit("setMinimizedInfo", v);
      },
    },
  },
  async created() {
    await this.loadGroup(this.$route.params.id).then((res) => {
      if (res.status === 200) {
        this.tablesPaginationEnable = true;
      }
    });
    if (this.getGroup.id) {
      this.rowsPosts = this.getGroup.posts.map((post) => {
        if (post.postStatusUpdatedOnUtc) {
          post.postStatusUpdatedOnUtc = this.$moment(post.postStatusUpdatedOnUtc).format(
            "MM/DD/YYYY"
          );
        }
        return post;
      });
    } else {
      this.$router.push({ name: "Groups" });
    }

    console.log(this.getGroup);
    if (this.$localStorage.get("activeSection")) {
      this.type = this.$localStorage.get("activeSection");
    }
    // window.addEventListener("resize", this.handleResize);
  },
  mounted() {
    this.tablesPaginationEnable = false;
  },
  watch: {
    $route(to, from) {
      if (to !== from) {
        //  this.$store.dispatch("clearGroup");
        this.loadGroup(this.$route.params.id);
      }
    },
    getGroup() {
      if (this.getGroup.id) {
        this.rowsEvents = [...this.getGroup.events];

        this.rowsMembers = this.getGroup.users.map((user) => {
          user.firstName = user.firstName + " " + user.lastName;
          if (user.inviteAcceptedOnUtc) {
            user.inviteAcceptedOnUtc = this.$moment
              .utc(user.inviteAcceptedOnUtc)
              .local()
              .format("MM/DD/YYYY");
          }
          return user;
        });
        this.rowsPosts = this.getGroup.posts.map((post) => {
          if (post.postStatusUpdatedOnUtc) {
            post.postStatusUpdatedOnUtc = this.$moment(
              post.postStatusUpdatedOnUtc
            ).format("MM/DD/YYYY");
          }
          return post;
        });
        this.showPreload = false;
        this.joinCodeActive = !!this.getGroup.joinCode;
        this.joinCodeActive = this.getGroup.joinCodeEnabled;
        this.joinUrlInner = this.getGroup.joinUrl ? this.getGroup.joinUrl : null;
      } else {
        this.$router.push({ name: "Groups" });
      }
    },

    showQR: function (value) {
      if (value) {
        document.body.classList.add("modal-opened");
      } else {
        document.body.classList.remove("modal-opened");
      }
    },
    showDescription: function (value) {
      if (value) {
        document.body.classList.add("modal-opened");
      } else {
        document.body.classList.remove("modal-opened");
      }
    },
  },
  beforeDestroy() {
    this.$store.dispatch("clearGroup");
    this.$store.dispatch("searchGroup");

    if (this.$localStorage.get("activeSection")) {
      this.$localStorage.set("activeSection", "Events");
    }
  },
  // destroyed() {
  //   window.removeEventListener("resize", this.handleResize);
  // },
};
</script>

<style lang="scss">
@import "./../../style/components/_table";
@import "./../../style/_groop.scss";
</style>
