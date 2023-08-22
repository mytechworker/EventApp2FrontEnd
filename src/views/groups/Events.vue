<template>
  <div>
    <div class="group-single__headline mb-30 w-100" v-if="isGroupAdmin || isSystemAdmin">
      <c-button
        variant="info"
        size="sm"
        tag="button"
        class="ml-auto px-15 btn-mobile-fixed"
        @click="editEvent({})"
      >
        Add event
      </c-button>
    </div>
    <div class="table-container__loader" v-if="this.showPreload">
      <img svg-inline src="@/assets/svg/loader.svg" height="60px" width="60px" />
    </div>
    <span class="btn-show-group-details" @click="$emit('minimizedInfo')">
      <img svg-inline src="@/assets/svg/info-toggle.svg" width="25" />
    </span>
    <vue-good-table
      class="custom-table p-5 custom-table-events"
      :columns="columnsEvents"
      :rows="rowsEvents"
      :search-options="{ enabled: true, placeholder: 'Search' }"
      :pagination-options="{
        enabled: tablesPaginationEnable,
        prevLabel: '',
        nextLabel: '',
      }"
      :sort-options="{
        enabled: true,
        initialSortBy: { field: 'startDateTime', type: 'desc' },
      }"
    >
      <template slot="table-row" slot-scope="props">
        <div
          class="responsive-cell"
          v-if="props.column.field === 'title' && (isGroupAdmin || isSystemAdmin)"
        >
          <span class="responsive-cell__desktop">{{ props.row.title }}</span>
          <div class="responsive-cell__mobile">
            <div class="responsive-cell__mobile-top">
              <div class="details-row">
                <div class="details-row__col">
                  <span>Name</span>
                  <p>{{ props.row.title }}</p>
                </div>
                <div class="details-row__col">
                  <span>When</span>
                  <p>
                    {{
                      $moment.utc(props.row.startDateTime).local().format("MM/DD/YYYY")
                    }}
                  </p>
                </div>
              </div>
            </div>
            <div class="responsive-cell__mobile-bottom">
              <c-button
                variant="plain"
                class="edit-btn"
                @click="editEvent(props.row)"
                tag="button"
                v-tooltip="'Edit'"
              >
                <img
                  svg-inline
                  src="@/assets/svg/icon-edit.svg"
                  height="18px"
                  width="18px"
                />
              </c-button>
              <c-button
                variant="plain"
                class="ml-15 remove-btn"
                @click="deleteEvent(props.row.id, props.row.title)"
                tag="button"
                v-tooltip="'Delete'"
              >
                <img
                  svg-inline
                  src="@/assets/svg/icon-delete.svg"
                  height="21px"
                  width="21px"
                />
              </c-button>
              <c-button
                variant="plain"
                class="ml-15 edit-btn"
                @click="copyEvent(props.row.id)"
                tag="button"
                v-tooltip="'Duplicate'"
              >
                <img
                  svg-inline
                  src="@/assets/svg/icon-copy.svg"
                  height="23px"
                  width="24px"
                />
              </c-button>

              <!-- event draft icon -->
              <c-button
                variant="plain"
                class="ml-auto edit-btn btn-publish"
                tag="button"
                v-if="props.row.eventStatus === 0"
                @click="publishEvent(props.row.id)"
                v-tooltip="'Click to publish'"
              >
                <img
                  svg-inline
                  src="@/assets/svg/event-draft.svg"
                  height="24px"
                  width="24px"
                  style="fill: #909db1"
                />
                Tap to publish
              </c-button>
              <!-- event published icon -->
              <c-button
                variant="plain"
                class="ml-auto edit-btn btn-cancel"
                tag="button"
                v-if="props.row.eventStatus === 1"
                @click="settingsToggleFun(props.row.id, props.row.title)"
                v-tooltip="'Click to cancel'"
              >
                <img
                  svg-inline
                  src="@/assets/svg/icon-time.svg"
                  height="25px"
                  width="24px"
                />
                Tap to cancel
              </c-button>
              <!-- event cancelled icon -->
              <c-button
                variant="plain"
                class="ml-auto edit-btn btn-no-action btn-canceled"
                tag="button"
                v-if="props.row.eventStatus > 1 && !isSystemAdmin"
                v-tooltip="'Cancelled'"
              >
                <img
                  svg-inline
                  src="@/assets/svg/event-cancelled.svg"
                  height="16px"
                  width="16px"
                  style="fill: lightgray"
                />
                Canceled
              </c-button>
              <c-button
                variant="plain"
                class="ml-auto edit-btn btn-canceled"
                tag="button"
                v-if="props.row.eventStatus > 1 && isSystemAdmin"
                v-tooltip="'Cancelled'"
                @click="publishEvent(props.row.id)"
              >
                <img
                  svg-inline
                  src="@/assets/svg/event-cancelled.svg"
                  height="16px"
                  width="16px"
                  style="fill: lightgray"
                />
                Canceled
              </c-button>
            </div>
          </div>
        </div>

        <div
          class="group-actions"
          v-else-if="props.column.field === 'action' && (isGroupAdmin || isSystemAdmin)"
        >
          <c-button
            variant="plain"
            class="edit-btn"
            @click="editEvent(props.row)"
            tag="button"
            v-tooltip="'Edit'"
          >
            <img svg-inline src="@/assets/svg/icon-edit.svg" height="18px" width="18px" />
          </c-button>
          <c-button
            variant="plain"
            class="ml-15 remove-btn"
            @click="deleteEvent(props.row.id, props.row.title)"
            tag="button"
            v-tooltip="'Delete'"
          >
            <img
              svg-inline
              src="@/assets/svg/icon-delete.svg"
              height="21px"
              width="21px"
            />
          </c-button>
          <c-button
            variant="plain"
            class="ml-15 edit-btn"
            @click="copyEvent(props.row.id)"
            tag="button"
            v-tooltip="'Duplicate'"
          >
            <img svg-inline src="@/assets/svg/icon-copy.svg" height="23px" width="24px" />
          </c-button>
          <!-- event draft icon -->
          <c-button
            variant="plain"
            class="ml-15 edit-btn"
            tag="button"
            v-if="props.row.eventStatus === 0"
            @click="publishEvent(props.row.id)"
            v-tooltip="'Click to publish'"
          >
            <img
              svg-inline
              src="@/assets/svg/event-draft.svg"
              height="24px"
              width="24px"
              style="fill: #909db1"
            />
          </c-button>
          <!-- event published icon -->
          <c-button
            variant="plain"
            class="ml-15 edit-btn"
            tag="button"
            v-if="props.row.eventStatus === 1"
            @click="settingsToggleFun(props.row.id, props.row.title)"
            v-tooltip="'Click to cancel'"
          >
            <img svg-inline src="@/assets/svg/icon-time.svg" height="25px" width="24px" />
          </c-button>
          <!-- event cancelled icon -->
          <c-button
            variant="plain"
            class="ml-15 edit-btn btn-no-action"
            tag="button"
            v-if="props.row.eventStatus > 1 && !isSystemAdmin"
            v-tooltip="'Cancelled'"
          >
            <img
              svg-inline
              src="@/assets/svg/event-cancelled.svg"
              height="16px"
              width="16px"
              style="fill: lightgray"
            />
          </c-button>
          <c-button
            variant="plain"
            class="ml-15 edit-btn"
            tag="button"
            v-if="props.row.eventStatus > 1 && isSystemAdmin"
            v-tooltip="'Cancelled'"
            @click="publishEvent(props.row.id)"
          >
            <img
              svg-inline
              src="@/assets/svg/event-cancelled.svg"
              height="16px"
              width="16px"
              style="fill: lightgray"
            />
          </c-button>
        </div>
      </template>
    </vue-good-table>

    <transition name="fade" mode="out-in" v-if="settingsToggle">
      <c-event-setting-modal
        :type="editDialog"
        @save="cancelEvent"
        @cancel="settingsToggle = false"
      />
    </transition>
  </div>
</template>

<script>
import { VueGoodTable } from "vue-good-table";
export default {
  components: {
    "vue-good-table": VueGoodTable,
    /* -------------------------- event setting dialog -------------------------- */
    "c-event-setting-modal": () => import("@/components/modals/eventSetting"),
  },
  data() {
    return {
      settingsToggle: false,
      editDialog: false,
      columnsEvents: [
        {
          label: "Name",
          field: "title",
          thClass: "desktop-only",
        },
        {
          label: "Where",
          field: "location",
          tdClass: "desktop-only",
          thClass: "desktop-only",
        },
        {
          label: "When",
          field: "startDateTime",
          formatFn: (val) => this.$moment.utc(val).local().format("MM/DD/YYYY"),
          width: "15%",
          tdClass: "desktop-only",
          thClass: "desktop-only",
        },
        {
          label: "Attendees",
          field: "attendeesCount",
          filterable: false,
          sortable: false,
          width: "15%",
          tdClass: "desktop-only",
          thClass: "desktop-only",
        },
        {
          label: "",
          field: "action",
          filterable: false,
          sortable: false,
          width: "15%",
          tdClass: "col-actions desktop-only",
          thClass: "desktop-only",
        },
      ],
      activeEvent: {
        id: null,
        title: null,
      },
    };
  },
  props: {
    tablesPaginationEnable: {
      default: true,
      type: Boolean,
    },
    rowsEvents: {
      default: null,
      type: Array,
    },
    showPreload: {
      default: true,
      type: Boolean,
    },
    isGroupAdmin: {
      default: false,
      type: Boolean,
    },
    isSystemAdmin: {
      default: false,
      type: Boolean,
    },
  },
  methods: {
    editEvent(event) {
      this.$store.dispatch("setCurrentEvent", event);
      this.$store.dispatch("setActiveModal", "event");
    },
    settingsToggleFun(id, title) {
      this.settingsToggle = true;
      this.activeEvent.id = id;
      this.activeEvent.title = title;
      // if (this.model.recurrence.value !== 0) {
      // } else {
      //   this.cancelEvent();
      // }
    },
    deleteEvent(id, text) {
      this.$confirm({
        title: "Are you sure?",
        message: `You want to delete ${text} event!`,
        button: {
          no: "Cancel",
          yes: "Delete",
        },
        callback: (confirm) => {
          if (confirm) {
            this.setLoadingStatus(true);
            this.makeRequest("EVENT_DELETE", "DELETE", null, id).then(() => {
              this.setLoadingStatus(false);
              this.$notify({
                group: "system",
                title: "Great!",
                text: "Event has been removed!",
                type: "warning",
              });
              this.loadGroup(this.$route.params.id);
            });
          }
        },
      });
    },
    copyEvent(id) {
      let url = ["DUPLICATES_EVENT", id];
      this.setLoadingStatus(true);
      this.makeRequest(url, "POST", null, id).then(() => {
        this.setLoadingStatus(false);
        this.$notify({
          group: "system",
          title: "Great!",
          text: "Event has been copied!",
          type: "warning",
        });
        this.loadGroup(this.$route.params.id);
      });
    },
    publishEvent(id) {
      let url = ["EVENT_PUBLISH", id];
      this.setLoadingStatus(true);
      this.makeRequest(url, "POST", null, id).then(() => {
        this.setLoadingStatus(false);
        this.$notify({
          group: "system",
          title: "Great!",
          text: "Event has been published!",
          type: "success",
        });
        this.loadGroup(this.$route.params.id);
      });
    },

    cancelEvent() {
      const id = this.activeEvent.id;
      const title = this.activeEvent.title;
      console.log(title);
      this.$confirm({
        title: "Are you sure?",
        message: `You want to cancel ${title} event!`,
        button: {
          no: "no",
          yes: "Cancel event",
        },
        callback: (confirm) => {
          if (confirm) {
            let url = ["EVENT_CANCEL", id];
            this.setLoadingStatus(true);
            this.makeRequest(url, "POST", null, id).then(() => {
              this.setLoadingStatus(false);
              this.$notify({
                group: "system",
                title: "Great!",
                text: "Event has been cancelled!",
                type: "success",
              });
              this.loadGroup(this.$route.params.id);
            });
          }
        },
      });
    },
  },
};
</script>
