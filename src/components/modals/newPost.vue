<template>
  <div class="post-modal">
    <div class="post-modal__loader" v-if="this.showPreload">
      <img svg-inline src="@/assets/svg/loader.svg" height="60px" width="60px" />
    </div>
    <div class="h1 mb-30">
      {{ this.model.id ? "Editing - " + this.model.title : "Add New Post" }}
    </div>
    <div class="modal-tabs">
      <div class="modal-tabs__navigation">
        <span
          v-for="(tab, index) in postTabs"
          :key="tab"
          @click="activeEditModalTab = index"
          :class="{
            active: activeEditModalTab == index,
          }"
        >
          {{ tab }}
        </span>
      </div>
      <div class="modal-tabs__content">
        <div class="modal-tabs__content-tab" :class="{ active: activeEditModalTab == 0 }">
          <ValidationObserver
            ref="postObserver"
            tag="div"
            class="form-wrap"
            v-slot="{ invalid, dirty }"
          >
            <!--IMAGE-->
            <div class="group-single__info-image with-sized w-100 mobile">
              <div class="img-sized">
                <img src="@/assets/img/360x160.png" />
              </div>
              <div class="img-cut">
                <img
                  :src="model.photo.url"
                  v-if="!isEdit && model.photo && model.photo.url"
                />
                <template v-if="uploadedImg">
                  <img :src="'data:image/png;base64, ' + uploadedImg.binary" />
                </template>
                <c-image-upload-simple
                  :hasPhoto="!!editedImgURL || !!uploadedImg || !!model.photo"
                  @ready="changePhoto"
                  @deleteImage="deleteImage"
                />
              </div>
            </div>
            <div class="w-100">
              <span class="fs-14 mb-5 color-gray-secondary field-label"> Title </span>
              <c-input
                placeholder=""
                :rules="{ required: true }"
                name="Title"
                v-model="model.title"
                class="mb-12 w-100"
              />
            </div>
            <div class="w-100 row-fields">
              <div class="form-wrap__long__column">
                <span class="fs-14 mb-5 color-gray-secondary field-label">
                  Description
                </span>
                <div v-if="allowRichEditor" class="new_post-editor">
                  <rich-editor
                    v-model="model.description"
                    height="162"
                    @change="inputChenged = true"
                  />
                </div>
                <c-textarea
                  v-else
                  class="w-100"
                  height="115px"
                  v-model="model.description"
                  placeholder="Description"
                  @change="inputChenged = true"
                />

                <div class="recorder_wrapper">
                  <div class="recorder">
                    <p class="header">Audio recording</p>
                    <!-- <h5>{{ timer }}</h5> -->
                    <div class="vue-rec" @click="start()">
                      <vue-record-audio mode="press" @result="onResult" />
                    </div>
                  </div>
                  <div class="audio-breaker"></div>
                  <!--  eslint-disable vue/no-use-v-if-with-v-for -->
                  <div
                    class="player"
                    v-if="audio_list.length"
                    v-for="(file, index) in audio_list"
                    :key="file.audio"
                  >
                    <audio
                      :src="file.audio"
                      controls="controls"
                      controlsList="nodownload"
                    ></audio>
                    <img
                      svg-inline
                      src="@/assets/svg/delete.svg"
                      height="10px"
                      width="10px"
                      class="audio-deleter"
                      @click="removeAudio(index)"
                    />
                  </div>
                </div>
              </div>

              <div class="form-wrap__column-third image-column column-image pc">
                <span class="fs-14 mb-5 color-gray-secondary field-label">
                  Image
                  <template v-if="model.id"
                    >(<span @click="isEdit = !isEdit">edit</span>)</template
                  >
                </span>
                <!--IMAGE-->
                <div class="group-single__info-image with-sized w-100 pc">
                  <img
                    :src="model.photo.url"
                    v-if="!isEdit && model.photo && model.photo.url"
                  />
                  <template v-if="uploadedImg">
                    <img :src="'data:image/png;base64, ' + uploadedImg.binary" />
                  </template>
                  <c-image-upload-simple
                    :hasPhoto="!!editedImgURL || !!uploadedImg || !!model.photo"
                    @ready="changePhoto"
                    @deleteImage="deleteImage"
                  />
                </div>
                <!-- settings -->
                <div class="mt-70 post__setting">
                  <h4>Chat settings</h4>
                  <div class="breaker"></div>
                  <div class="radio_holder">
                    <div class="radio-item">
                      <input
                        type="radio"
                        v-model="model.conversation.access"
                        id="ritema"
                        name="ritem"
                        value="0"
                        @click="settingsChanged = true"
                      />
                      <label for="ritema">Anyone can post messages</label>
                    </div>

                    <div class="radio-item">
                      <input
                        type="radio"
                        v-model="model.conversation.access"
                        id="ritemb"
                        name="ritem"
                        value="1"
                        @click="settingsChanged = true"
                      />
                      <label for="ritemb">Only admins can post messages</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-20 w-100 text-right modal-actions">
              <c-button
                variant="plain"
                tag="button"
                @click="$store.dispatch('setActiveModal', null)"
                size="sm"
                class="button-cancel fs-16"
              >
                Cancel
              </c-button>
              <div class="modal-actions__submit">
                <c-button
                  tag="button"
                  class="ml-auto mr-15"
                  size="sm"
                  variant="outline-info"
                  @click="createPost()"
                  v-if="!model.id"
                >
                  Save to drafts
                </c-button>
                <c-button
                  variant="info"
                  tag="button"
                  size="sm"
                  :disabled="isFormChange(invalid, dirty)"
                  @click="createPost()"
                  v-if="model.id"
                >
                  {{ model.id ? "Save" : "Publish" }}
                </c-button>
              </div>
            </div>
          </ValidationObserver>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    "c-image-upload-simple": () => import("@/components/image-upload-simple"),
    "rich-editor": () => import("@/components/rich-editor"),
  },
  data() {
    return {
      audio_list: [],
      elapsedTime: 0,
      timer: undefined,
      isEdit: false,
      postTabs: ["Details"],
      activeEditModalTab: 0,
      allowRichEditor: true,
      model: {
        title: "",
        description: "",
        coverImage: "",
        conversation: {
          access: 0,
        },
      },
      showPreload: true,
      uploadedImg: null,
      editedImgURL: null,
      inputChenged: false,
      imageChanged: false,
      settingsChanged: false,
    };
  },
  computed: {
    formattedElapsedTime() {
      const date = new Date(null);
      date.setSeconds(this.elapsedTime / 1000);
      const utc = date.toUTCString();
      return utc.substr(utc.indexOf(":") - 2, 8);
    },
  },
  methods: {
    start() {
      this.timer = setInterval(() => {
        this.elapsedTime += 1000;
      }, 1000);
    },
    stop() {
      clearInterval(this.timer);
    },
    reset() {
      this.elapsedTime = 0;
    },
    onResult(data) {
      const audio_file = {
        audio: window.URL.createObjectURL(data),
      };
      this.audio_list.push(audio_file);
    },
    removeAudio(val) {
      this.audio_list.splice(val, 1);
    },
    zeroPrefix(num, digit) {
      var zero = "";
      for (var i = 0; i < digit; i++) {
        zero += "0";
      }
      return (zero + num).slice(-digit);
    },
    async createPost() {
      const valid = await this.$refs.postObserver.validate();
      if (!valid) {
        return false;
      }

      let url, text, method;
      if (this.model.id) {
        url = "POST_UPDATE";
        text = "Post has been updated!";
        method = "PUT";
      } else {
        url = "POST_CREATE";
        text = "Post has been created!";
        method = "POST";
        this.model.groupId = this.$route.params.id;
      }

      this.setLoadingStatus(true);
      this.makeRequest(url, method, this.model).then((res) => {
        if (res.status === 200 && this.$route.params.id) {
          if (this.uploadedImg) {
            this.uploadPostPhoto(this.uploadedImg, res.data.id)
              .then(() => {
                this.loadGroup(this.$route.params.id).then((response) => {
                  if (response && response.status === 200) {
                    this.$notify({
                      group: "system",
                      title: "Great!",
                      text,
                      type: "success",
                    });
                    this.$store.dispatch("setActiveModal", null);
                  }
                });
              })
              .catch((error) => {
                this.resolveError(error);
                this.loadEventInternal(res.data.id);
                this.uploadedImg = null;
                this.loadGroup(this.$route.params.id);
              });
          } else if (this.imageChenged) {
            const url = `/post/${this.model.id}/photo`;
            this.deleteImg(url, this.model).then((response) => {
              if (response && response.status === 200) {
                this.$notify({
                  group: "system",
                  title: "Great!",
                  text,
                  type: "success",
                });
                this.$store.dispatch("setActiveModal", null);
              }
            });
          } else {
            this.loadGroup(this.$route.params.id).then((response) => {
              if (response && response.status === 200) {
                this.$notify({
                  group: "system",
                  title: "Great!",
                  text,
                  type: "success",
                });
                this.$store.dispatch("setActiveModal", null);
              }
            });
          }
          this.setLoadingStatus(false);
        }
      });
    },
    loadPostInternal(id) {
      this.loadPost(id).then((response) => {
        if (response && response.status === 200) {
          this.model = { ...response.data };
          this.showPreload = false;
          console.log("loadPostInternal", this.model.id, this.model);
        }
      });
    },
    changePhoto(img) {
      this.imageChenged = true;
      this.editedImgURL = img;
      this.uploadedImg = null;
      this.uploadedImg = img;
    },
    uploadPostPhoto(img, postID = null) {
      if (!this.model.id) {
        this.uploadedImg = null;
        this.uploadedImg = img;
      }

      if (postID) {
        const url = `/post/${postID}/photo`;
        return this.uploadImgWithRezult(url, img);
      } else if (this.model.id) {
        const url = `/post/${this.model.id}/photo`;
        this.uploadImg(url, img).then((response) => {
          if (response && response.status === 200) {
            console.log("uploadPostPhoto", response.data);
            this.editedImgURL = response.data.url;
            this.model.photo = response.data;
            this.imageChanged = true;
          }
        });
      }
    },
    deleteImage() {
      this.uploadedImg = null;
      this.editedImgURL = null;
      this.model.photo.url = null;
      this.imageChenged = true;
    },
    isFormChange(invalid, dirty) {
      return !(
        invalid ||
        dirty ||
        this.inputChenged ||
        this.imageChenged ||
        this.settingsChanged
      );
    },
  },
  mounted() {
    var post = this.$store.getters.getPost;
    if (post && post.id) {
      this.showPreload = true;
      this.loadPostInternal(post.id);
    } else {
      this.showPreload = false;
    }
  },
  beforeDestroy() {
    this.$store.dispatch("setActiveModal", null);
    this.$store.dispatch("setCurrentPost", null);
  },
};
</script>

<style lang="scss">
@import "./../../style/components/modals/_new-post.scss";
.recorder_wrapper {
  position: relative;
  // margin-right: 52px;
  margin-top: 30px;
  .audio-breaker {
    margin-top: 15px;
    border: 1px solid #c7cdd8;
    margin-bottom: 22px;
  }
  .recorder {
    display: flex;
    align-items: center;
    .header {
      color: #909db1;
      font-size: 14px;
    }
    .vue-rec {
      margin-left: auto;
      .vue-audio-recorder {
        position: relative;
        background-color: #2889fc;
        border-radius: 50%;
        width: 31px;
        height: 32px;
        display: inline-block;
        cursor: pointer;
        -webkit-box-shadow: 0 0 0 0 rgb(232 76 61 / 70%);
        box-shadow: 0 0 0 0 rgb(232 76 61 / 70%);
      }
    }
  }
  .player {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    // audio {
    //   filter: sepia(20%) saturate(70%) grayscale(1) contrast(99%) invert(12%);
    //   width: 100%;
    //   height: 25px;
    // }
    .audio-deleter {
      margin-left: 17px;
      cursor: pointer;
    }
  }

  /*or*/

  audio::-webkit-media-controls-panel {
    background: white;
  }

  // audio::-webkit-media-controls-mute-button {
  //   display: none !important;
  // }

  audio::-webkit-media-controls-play-button {
    color: #2889fc;
  }

  audio::-webkit-media-controls-timeline-container {
    background-color: blue;
  }

  // audio::-webkit-media-controls-current-time-display {
  //   display: none;
  // }

  // audio::-webkit-media-controls-time-remaining-display {
  //   display: block;
  // }

  // audio::-webkit-media-controls-timeline {
  //   border-color: #2889fc;
  // }

  // audio::-webkit-media-controls-volume-slider-container {
  //   display: none !important;
  // }

  // audio::-webkit-media-controls-volume-slider {
  //   display: none !important;
  // }

  // audio::-webkit-media-controls-seek-back-button

  // audio::-webkit-media-controls-seek-forward-button

  // audio::-webkit-media-controls-fullscreen-button

  // audio::-webkit-media-controls-rewind-button

  // audio::-webkit-media-controls-return-to-realtime-button

  // audio::-webkit-media-controls-toggle-closed-captions-button
}
</style>
