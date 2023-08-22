<template>
  <div>
    <div class="group-single__headline mb-30 w-100" v-if="isGroupAdmin || isSystemAdmin">
      <c-button
        variant="info"
        size="sm"
        tag="button"
        class="ml-auto px-15 btn-mobile-fixed"
        @click="editPost({})"
      >
        Add post
      </c-button>
    </div>
    <div class="table-container__loader" v-if="this.showPreload">
      <img svg-inline src="@/assets/svg/loader.svg" height="60px" width="60px" />
    </div>
    <span class="btn-show-group-details" @click="$emit('minimizedInfo')">
      <img svg-inline src="@/assets/svg/info-toggle.svg" width="25" />
    </span>
    <vue-good-table
      v-if="rowsPosts"
      class="custom-table p-5 custom-table-posts"
      :columns="columnsPosts"
      :rows="rowsPosts"
      :search-options="{ enabled: true, placeholder: 'Search' }"
      :pagination-options="{
        enabled: tablesPaginationEnable,
        prevLabel: '',
        nextLabel: '',
      }"
      :sort-options="{
        enabled: true,
        initialSortBy: { field: 'postStatusUpdatedOnUtc', type: 'desc' },
      }"
    >
      <template slot="table-row" slot-scope="props">
        <div
          class="responsive-cell"
          v-if="
            props.column.field === 'postStatusUpdatedOnUtc' &&
            (isGroupAdmin || isSystemAdmin)
          "
        >
          {{ props.row.postStatusUpdatedOnUtc }}
        </div>
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
                  <p v-if="props.row.postStatusUpdatedOnUtc">
                    {{
                      $moment
                        .utc(props.row.postStatusUpdatedOnUtc)
                        .local()
                        .format("MM/DD/YYYY")
                    }}
                  </p>
                </div>
              </div>
            </div>
            <div class="responsive-cell__mobile-bottom">
              <c-button
                variant="plain"
                class="edit-btn"
                @click="editPost(props.row)"
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
                @click="deletePost(props.row.id, props.row.title)"
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
                @click="copyPost(props.row.id)"
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
              <!-- post draft icon -->
              <c-button
                variant="plain"
                class="ml-auto edit-btn btn-publish"
                tag="button"
                v-if="props.row.postStatus === 0"
                @click="publishPost(props.row.id)"
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
              <!-- post published icon -->
              <c-button
                variant="plain"
                class="ml-auto edit-btn btn-cancel"
                tag="button"
                v-if="props.row.postStatus === 1"
                @click="cancelPost(props.row.id, props.row.title)"
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
              <!-- post cancelled icon -->
              <c-button
                variant="plain"
                class="ml-auto edit-btn btn-canceled"
                tag="button"
                v-if="props.row.postStatus > 1"
                @click="publishPost(props.row.id)"
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
            </div>
          </div>
        </div>

        <div
          class="group-actions"
          v-if="props.column.field === 'action' && (isGroupAdmin || isSystemAdmin)"
        >
          <c-button
            variant="plain"
            class="edit-btn"
            @click="editPost(props.row)"
            tag="button"
            v-tooltip="'Edit'"
          >
            <img svg-inline src="@/assets/svg/icon-edit.svg" height="18px" width="18px" />
          </c-button>
          <c-button
            variant="plain"
            class="ml-15 remove-btn"
            @click="deletePost(props.row.id, props.row.title)"
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
            @click="copyPost(props.row.id)"
            tag="button"
            v-tooltip="'Duplicate'"
          >
            <img svg-inline src="@/assets/svg/icon-copy.svg" height="23px" width="24px" />
          </c-button>
          <!-- post draft icon -->
          <c-button
            variant="plain"
            class="ml-15 edit-btn"
            tag="button"
            v-if="props.row.postStatus === 0"
            @click="publishPost(props.row.id)"
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
          <!-- post published icon -->
          <c-button
            variant="plain"
            class="ml-15 edit-btn"
            tag="button"
            v-if="props.row.postStatus === 1"
            @click="cancelPost(props.row.id, props.row.title)"
            v-tooltip="'Click to cancel'"
          >
            <img svg-inline src="@/assets/svg/icon-time.svg" height="25px" width="24px" />
          </c-button>
          <!-- post cancelled icon -->
          <c-button
            variant="plain"
            class="ml-15 edit-btn"
            tag="button"
            v-if="props.row.postStatus > 1"
            @click="publishPost(props.row.id)"
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
        </div>
      </template>
    </vue-good-table>
  </div>
</template>
<script>
import { VueGoodTable } from "vue-good-table";
export default {
  components: {
    "vue-good-table": VueGoodTable,
  },
  props: {
    tablesPaginationEnable: {
      default: true,
      type: Boolean,
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
    rowsPosts: {
      default: null,
      type: Array,
    },
  },
  data() {
    return {
      columnsPosts: [
        {
          label: "Title",
          field: "title",
          thClass: "desktop-only",
        },
        {
          label: "When",
          field: "postStatusUpdatedOnUtc",
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
    };
  },
  methods: {
    editPost(post) {
      this.$store.dispatch("setCurrentPost", post);
      this.$store.dispatch("setActiveModal", "post");
    },
    deletePost(id, text) {
      this.$confirm({
        title: "Are you sure?",
        message: `You want to delete ${text} post!`,
        button: {
          no: "Cancel",
          yes: "Delete",
        },
        callback: (confirm) => {
          if (confirm) {
            this.setLoadingStatus(true);
            this.makeRequest("POST_DELETE", "DELETE", null, id).then(() => {
              this.setLoadingStatus(false);
              this.$notify({
                group: "system",
                title: "Great!",
                text: "Post has been removed!",
                type: "warning",
              });
              this.loadGroup(this.$route.params.id);
            });
          }
        },
      });
    },
    cancelPost(id, text) {
      this.$confirm({
        title: "Are you sure?",
        message: `You want to cancel ${text} post!`,
        button: {
          no: "no",
          yes: "Cancel post",
        },
        callback: (confirm) => {
          if (confirm) {
            let url = ["POST_CANCEL", id];
            this.setLoadingStatus(true);
            this.makeRequest(url, "POST", null, id).then(() => {
              this.setLoadingStatus(false);
              this.$notify({
                group: "system",
                title: "Great!",
                text: "Post has been cancelled!",
                type: "success",
              });
              this.loadGroup(this.$route.params.id);
            });
          }
        },
      });
    },
    copyPost(id) {
      let url = ["DUPLICATES_POST", id];
      this.setLoadingStatus(true);
      this.makeRequest(url, "POST", null, id).then(() => {
        this.setLoadingStatus(false);
        this.$notify({
          group: "system",
          title: "Great!",
          text: "Post has been copied!",
          type: "warning",
        });
        this.loadGroup(this.$route.params.id);
      });
    },
    publishPost(id) {
      let url = ["POST_PUBLISH", id];
      this.setLoadingStatus(true);
      this.makeRequest(url, "POST", null, id).then(() => {
        this.setLoadingStatus(false);
        this.$notify({
          group: "system",
          title: "Great!",
          text: "Post has been published!",
          type: "success",
        });
        this.loadGroup(this.$route.params.id);
      });
    },
  },
};
</script>
