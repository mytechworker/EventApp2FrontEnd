<template>
  <div class="event_setting-dialog">
    <div class="modal">
      <div class="settings__content">
        <div class="h1">{{ type ? "Edit" : "Cancel" }} recurring event</div>
        <div class="mt-20">
          <div class="radio_holder">
            <div class="radio-item">
              <input type="radio" v-model="setting" id="current" name="ritem" value="0" />
              <label for="current">This event</label>
            </div>

            <div class="radio-item">
              <input
                type="radio"
                v-model="setting"
                id="currentFollowing"
                name="ritem"
                value="1"
              />
              <label for="currentFollowing">This and following events</label>
            </div>

            <div class="radio-item">
              <input type="radio" v-model="setting" id="all" name="ritem" value="2" />
              <label for="all">All events</label>
            </div>

            <div class="mt-30 settings_action">
              <c-button
                variant="outline-info"
                tag="button"
                size="sm"
                class="button-cancel fs-16"
                @click="closeSetting"
              >
                Cancel
              </c-button>
              <c-button
                @click="saveSetting"
                tag="button"
                class="fs-16 confirm_btn"
                size="sm"
                variant="info"
              >
                OK
              </c-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    admin: {
      type: Boolean,
      default: false,
    },
    type: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      setting: 0,
    };
  },
  methods: {
    saveSetting() {
      this.$emit("save", this.setting);
    },
    closeSetting() {
      this.$emit("cancel");
    },
  },
  mounted() {},
  beforeDestroy() {
    // this.$store.dispatch("setActiveModal", null);
  },
};
</script>

<style lang="scss">
@import "./../../style/components/modals/_event-setting.scss";
.radio_holder {
  display: flex;
  flex-direction: column;

  .radio-item {
    display: inline-block;
    position: relative;
    padding: 0 6px;
    margin: 10px 0 0;
  }

  .radio-item input[type="radio"] {
    display: none;
  }

  .radio-item label {
    color: #445161;
    font-size: 14px;
    font-weight: normal;
    position: relative;
  }

  .radio-item label:before {
    content: " ";
    display: inline-block;
    position: relative;
    top: 5px;
    margin: 0 5px 0 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid #2889fc;
    background-color: transparent;
  }

  .radio-item input[type="radio"]:checked + label:after {
    border-radius: 11px;
    width: 12px;
    height: 12px;
    position: absolute;
    top: 1.5px;
    left: 6px;
    content: " ";
    display: block;
    background: #2889fc;
  }
}
</style>
