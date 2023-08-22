<template>
  <div>
    <div class="group-single__headline mb-30 w-100" v-if="isGroupAdmin || isSystemAdmin">
      <c-button
        tag="button"
        class="ml-auto mr-15 px-15 btn-mobile-fixed"
        size="sm"
        variant="outline-info"
        @click="addGroupUser(false)"
      >
        + Add member
      </c-button>
      <c-user-import
        endpoint="USERS_IMPORT"
        @onUploadResponse="onUploadHandler"
        class="btn-import"
      >
        Import
      </c-user-import>
    </div>
    <div class="table-container__loader" v-if="this.showPreload">
      <img svg-inline src="@/assets/svg/loader.svg" height="60px" width="60px" />
    </div>
    <span class="btn-show-group-details" @click="$emit('minimizedInfo')">
      <img svg-inline src="@/assets/svg/info-toggle.svg" width="25" />
    </span>
    <vue-good-table
      class="custom-table p-5 mb-30 custom-table-members"
      :columns="columnsMembers"
      :rows="rowsMembers"
      :search-options="{ enabled: true, placeholder: 'Search' }"
      :pagination-options="{
        enabled: tablesPaginationEnable,
        prevLabel: '',
        nextLabel: '',
      }"
      :sort-options="{
        enabled: true,
        initialSortBy: { field: 'inviteAcceptedOnUtc', type: 'asc' },
      }"
    >
      <template slot="table-row" slot-scope="props">
        <div v-if="props.column.field === 'isAdmin' && (isGroupAdmin || isSystemAdmin)">
          <c-checkbox
            :checked="props.row.isAdmin ? true : false"
            @change="makeAdmin(props.row)"
            type="switcher"
            tag="checkbox"
          >
          </c-checkbox>
        </div>
        <div
          v-else-if="props.column.field === 'action' && (isGroupAdmin || isSystemAdmin)"
        >
          <c-button
            variant="plain"
            class="remove-btn"
            @click="deleteGroupUser(props.row.id, props.row.email)"
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
        </div>

        <div v-else-if="props.column.field === 'firstName'" class="user-name-col">
          <div class="user-name-col-image-wrap">
            <span v-if="props.row.photo" class="user-name-col__image">
              <img :src="props.row.photo.url" alt="" />
            </span>
            <span v-else class="user-name-col__image">
              <img
                svg-inline
                src="@/assets/svg/icon-user.svg"
                height="30px"
                width="30px"
              />
            </span>
            <span class="icon-crown" v-if="props.row.isOwner">
              <img svg-inline src="@/assets/svg/icon-crown.svg" />
            </span>
          </div>
          <span>{{ props.row.title }}</span>
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
    "c-user-import": () => import("@/components/file-uploader"),
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
    rowsMembers: {
      default: null,
      type: Array,
    },
  },
  data() {
    return {
      columnsMembers: [
        {
          label: "Name",
          field: "firstName",
        },
        {
          label: "Email",
          field: "email",
        },
        {
          label: "Join Date",
          field: "inviteAcceptedOnUtc",
          sortable: true,
          firstSortType: "desc",
          type: "date",
          dateInputFormat: "MM/dd/yyyy",
          dateOutputFormat: "MM/dd/yyyy",
          thClass: "vgt-left-align th-members-join desktop-only",
          tdClass: "vgt-left-align desktop-only",
        },
        {
          label: "Admin",
          field: "isAdmin",
          type: "boolean",
          sortable: true,
          thClass: "vgt-left-align1330px",
        },
        {
          label: "",
          field: "action",
          filterable: false,
          sortable: false,
        },
      ],
    };
  },
  methods: {
    makeAdmin(row) {
      console.log("makeAdmin", row.id, row.title, row.isAdmin);
      var api = row.isAdmin ? "API_GROUP_CANCEL_ADMIN" : "API_GROUP_MAKE_ADMIN";
      let url = [api, this.$route.params.id, row.id];
      this.setLoadingStatus(true);
      this.makeRequest(url, "POST", null, row.id).then(() => {
        this.setLoadingStatus(false);
        this.$notify({
          group: "system",
          title: "Great!",
          text: "User made as admin!",
          type: "warning",
        });
        this.loadGroup(this.$route.params.id);
      });
    },
    deleteGroupUser(id, text) {
      this.$confirm({
        title: "Are you sure?",
        message: `You want to delete ${text} user!`,
        button: {
          no: "Cancel",
          yes: "Delete",
        },
        callback: (confirm) => {
          if (confirm) {
            let url = ["REMOVE_GROUP_USER", this.$route.params.id, id];
            this.setLoadingStatus(true);
            this.makeRequest(url, "POST", null, id).then(() => {
              this.setLoadingStatus(false);
              this.$notify({
                group: "system",
                title: "Great!",
                text: "User has been removed!",
                type: "warning",
              });
              this.loadGroup(this.$route.params.id);
            });
          }
        },
      });
    },
    onUploadHandler(response) {
      console.log("onUploadHandler", response.data);
      if (response && response.data) {
        var file = response.data.files[0];
        console.log("onUploadHandler files", file);

        this.$store.dispatch("setCurrentFile", file);
        this.$store.dispatch("setActiveModal", "download");
      }
    },
    addGroupUser(admin) {
      let type = admin ? "groupAdmin" : "groupMember";
      this.$store.dispatch("setActiveModal", type);
    },
  },
};
</script>
