<template>
  <div>
    <div class="h1 mb-20">
      {{ admin ? "Add group admin" : "Invite Member" }}
    </div>
    <ValidationObserver tag="div" class="form-wrap" v-slot="{ invalid }">
      <div class="w-100">
        <v-select
          v-model="model.userId"
          v-if="admin"
          placeholder="User"
          :searchable="true"
          :clearable="false"
          :reduce="el => el.id"
          label="title"
          :options="getUsers"
        />

        <div class="form-row mb-20" v-if="!admin">
          <div class="form-row__column">
            <c-input
              v-model="model.firstName"
              name="Firstname"
              :rules="{ required: true }"
              placeholder="First name"
            />
          </div>
          <div class="form-row__column">
            <c-input
              v-model="model.lastName"
              name="Firstname"
              :rules="{ required: true }"
              placeholder="Last name"
            />
          </div>
        </div>

        <c-input
          v-model="model.userEmail"
          name="Email"
          :rules="{ required: true, email: true, type: 'eager' }"
          placeholder="Email"
        />

        <c-textarea
          v-if="!admin"
          class="w-100 mt-20"
          height="115px"
          v-model="model.description"
          :rules="{ required: false }"
          placeholder="Message"
        />
      </div>

      <div class="mt-20 w-100 text-right btn-container">
        <c-button
          variant="outline-warning"
          tag="button"
          @click="$store.dispatch('setActiveModal', null)"
          size="sm"
          class="btn-cancel"
        >
          Cancel
        </c-button>
        <c-button
          variant="info"
          tag="button"
          size="sm"
          :disabled="invalid"
          @click="addAdmin()"
          class="btn-submit"
        >
          {{ admin ? "Add" : "Send" }}
        </c-button>
      </div>
    </ValidationObserver>
  </div>
</template>

<script>
export default {
  props: {
    admin: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      model: {
        userEmail: "",
        userId: "",
        firstName: "",
        lastName: "",
        description: ""
      }
    };
  },
  methods: {
    addAdmin() {
      let url, text;
      if (this.admin) {
        url = ["API_GROUP_MAKE_ADMIN", this.model.groupId, this.model.userId];
        text = "User has been added as admin.";
      } else {
        url = ["API_GROUP_INVITE_EXTENDED", this.model.groupId];
        text = "User has been invited.";
      }

      let userExist = false;
      this.getGroup.users.forEach(user => {
        if (user.email === this.model.userEmail) {
          userExist = true;
        }
      });

      if (!userExist) {
        this.setLoadingStatus(true);
        this.makeRequest(url, "POST", this.model, null, false)
          .then(response => {
            if (response.status === 200 && this.$route.params.id) {
              this.setLoadingStatus(false);
              this.loadGroup(this.$route.params.id);
              this.$store.dispatch("setActiveModal", null);
              this.$notify({
                group: "system",
                title: "Great!",
                text,
                type: "success"
              });
            }
          })
          .catch(() => {
            this.setLoadingStatus(false);
            this.$notify({
              group: "system",
              title: "Oops!",
              text: "This user not found",
              type: "error"
            });
          });
      } else {
        this.setLoadingStatus(false);
        this.$notify({
          group: "system",
          title: "Oops!",
          text: "This user is already invited",
          type: "error"
        });
      }
    }
  },
  mounted() {
    this.model.groupId = this.$store.getters.getGroup.id;
  },
  beforeDestroy() {
    this.$store.dispatch("setActiveModal", null);
  }
};
</script>

<style lang="scss">
@import "./../../style/components/modals/_new-group-admin.scss";
</style>
