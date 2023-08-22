<template>
  <div>
    <div class="event-modal">
      <div class="event-modal__loader" v-if="this.showPreload">
        <img svg-inline src="@/assets/svg/loader.svg" height="60px" width="60px" />
      </div>
      <div class="h1 mb-30">
        {{ this.model.id ? "Editing - " + this.model.title : "Add New Event" }}
      </div>
      <div class="modal-tabs">
        <div class="modal-tabs__navigation" v-if="this.model.id">
          <span
            v-for="(tab, index) in eventTabs"
            :key="tab"
            @click="activeEditModalTab = index"
            :class="{
              active: activeEditModalTab == index,
              waitanswer: index == 2 && waitingForAnswer,
            }"
          >
            {{ tab }}
          </span>
        </div>

        <div class="modal-tabs__content">
          <div
            class="modal-tabs__content-tab"
            :class="{ active: activeEditModalTab == 0 }"
          >
            <ValidationObserver
              ref="eventObserver"
              tag="div"
              class="form-wrap"
              v-slot="{ invalid, dirty }"
            >
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
                    @ready="changePhoto"
                    @deleteImage="deleteImage"
                    :hasPhoto="!!editedImgURL || !!uploadedImg || !!model.photo"
                  />
                </div>
              </div>
              <div class="w-100">
                <span class="fs-14 mb-5 color-gray-secondary field-label">
                  Event name
                </span>
                <c-input
                  placeholder="Event name"
                  :rules="{ required: true }"
                  name="Title"
                  v-model="model.title"
                  class="mb-12 w-100"
                />
              </div>

              <div class="w-100 row-fields">
                <div class="form-wrap__column-third">
                  <span class="fs-14 mb-5 color-gray-secondary field-label"> Start </span>

                  <date-picker
                    placeholder="Start Date"
                    type="datetime"
                    format="MM/DD/YYYY hh:mm a"
                    :clearable="false"
                    v-model="model.startDateTime"
                    :not-before="disabledBefore"
                    :disabled-date="disableStartDate"
                    @change="setEventEndDate"
                    class="mb-12 w-100 required-data-picker"
                    :class="{ is_invalid: startDateInvalid }"
                  />
                </div>
                <div class="form-wrap__column-third">
                  <span class="fs-14 mb-5 color-gray-secondary field-label"> End </span>
                  <date-picker
                    placeholder="End Date"
                    type="datetime"
                    format="MM/DD/YYYY hh:mm a"
                    :clearable="false"
                    v-model="model.endDateTime"
                    :disabled-date="disableDate"
                    :disabled-time="disableTime"
                    :default-value="model.endDateTime"
                    @change="handeEventEndDateChange"
                    class="mb-12 w-100 required-data-picker"
                    :class="{ is_invalid: endDateInvalid }"
                  />
                </div>
                <div class="form-wrap__column-third">
                  <span class="fs-14 mb-5 color-gray-secondary field-label">
                    Recurrence
                  </span>
                  <c-select
                    :options="cronIntervalsTypes"
                    :default="model.recurrence"
                    class="select mb-12"
                    v-model="model.recurrence"
                    v-if="model.recurrence.name"
                    @change="inputChenged = true"
                  />
                </div>
              </div>

              <div class="w-100 row-fields">
                <div class="form-wrap__long__column">
                  <span class="fs-14 mb-5 color-gray-secondary field-label">
                    Location
                  </span>
                  <c-input
                    placeholder="Location"
                    :rules="{ required: true }"
                    name="Location"
                    v-model="model.location"
                    class="mb-10 w-100"
                  />
                </div>
                <div class="form-wrap__column-third">
                  <span class="fs-14 mb-5 color-gray-secondary field-label"> Price </span>
                  <c-input
                    placeholder="Price"
                    name="Price"
                    type="number"
                    :rules="{ required: true }"
                    v-model.trim="model.price"
                    class="mb-10 w-100"
                  />
                </div>
              </div>

              <div class="w-100 row-fields">
                <div class="form-wrap__column-third">
                  <span class="fs-14 mb-5 color-gray-secondary field-label">
                    Quorum
                  </span>
                  <c-input
                    placeholder="Quorum"
                    :rules="{ required: false }"
                    name="Quorum"
                    type="number"
                    v-model.trim="model.minAttendeesCount"
                    class="mb-10 w-100"
                  />
                </div>
                <div class="form-wrap__column-third">
                  <span class="fs-14 mb-5 color-gray-secondary field-label">
                    Capacity
                  </span>
                  <c-input
                    placeholder="Capacity"
                    name="Capacity"
                    type="number"
                    :rules="{ required: false }"
                    v-model="model.maxAttendeesCount"
                    class="mb-10 w-100"
                  />
                </div>
                <div class="form-wrap__column-third">
                  <span class="fs-14 mb-5 color-gray-secondary field-label">
                    Online
                  </span>
                  <div
                    class="zoom-actions mb-10"
                    :class="{
                      'has-url': model.meetingJoinUrl && model.meetingJoinUrl.length > 0,
                    }"
                  >
                    <button class="btn-zoom" @click="handleZoomClick">
                      <span>
                        <img svg-inline src="@/assets/svg/icon-zoom-blue.svg" />
                        {{
                          model.meetingJoinUrl && model.meetingJoinUrl.length
                            ? "Zoom"
                            : "Add Zoom"
                        }}
                      </span>
                      <span>cancel Zoom</span>
                    </button>
                    <a
                      :href="model.meetingJoinUrl"
                      target="_blank"
                      class="btn-zoom-link"
                      v-tooltip="'Open the meeting link'"
                      v-if="model.meetingJoinUrl && model.meetingJoinUrl.length > 0"
                    >
                      <img svg-inline src="@/assets/svg/icon-zoom-link.svg" />
                    </a>
                  </div>
                  <div
                    class="zoom-link"
                    v-if="model.meetingJoinUrl && model.meetingJoinUrl.length > 0"
                    v-tooltip="'Click to copy'"
                    @click="copyZoomLinkToClipboard"
                  >
                    <span>
                      {{ model.meetingJoinUrl }}
                    </span>
                    <small class="zoom-link__icon">
                      <img svg-inline src="@/assets/svg/icon-copy-blue.svg" />
                    </small>
                  </div>
                </div>
              </div>

              <div class="w-100 row-fields">
                <div class="form-wrap__long__column description-column">
                  <span class="fs-14 mb-5 color-gray-secondary field-label">
                    Description
                  </span>
                  <div v-if="allowRichEditor" class="new_event-editor">
                    <rich-editor
                      @change="inputChenged = true"
                      v-model="model.description"
                    />
                  </div>
                  <c-textarea
                    v-else
                    class="w-100"
                    height="115px"
                    v-model="model.description"
                    placeholder="Description"
                  />
                </div>
                <div class="form-wrap__column-third image-column pc">
                  <span class="fs-14 mb-5 color-gray-secondary field-label">
                    Image
                    <template v-if="model.id"
                      >(<span @click="isEdit = !isEdit">edit</span>)</template
                    >
                  </span>
                  <!--IMAGE-->
                  <div class="group-single__info-image w-100">
                    <img
                      :src="model.photo.url"
                      v-if="!isEdit && model.photo && model.photo.url"
                    />
                    <template v-if="uploadedImg">
                      <img :src="'data:image/png;base64, ' + uploadedImg.binary" />
                    </template>
                    <c-image-upload-simple
                      @ready="changePhoto"
                      @deleteImage="deleteImage"
                      :hasPhoto="!!editedImgURL || !!uploadedImg || !!model.photo"
                    />
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
                    class="ml-auto"
                    size="sm"
                    variant="outline-info"
                    @click="createEvent()"
                    v-if="!model.id"
                  >
                    Save to drafts
                  </c-button>
                  <c-button
                    variant="info"
                    tag="button"
                    size="sm"
                    :disabled="isFormChange(invalid, dirty)"
                    @click="settingsToggleFun()"
                    v-if="model.id"
                  >
                    {{ model.id ? "Save" : "Publish" }}
                  </c-button>
                </div>
              </div>
            </ValidationObserver>
          </div>

          <div
            class="modal-tabs__content-tab"
            v-if="this.model.id"
            :class="{ active: activeEditModalTab == 1 }"
          >
            <!--PARTICIPANTS TABLE-->
            <vue-good-table
              class="custom-table custom-table-attendees"
              :columns="columnsParticipants"
              :rows="rowsParticipants"
              :pagination-options="{
                enabled: tablesPaginationEnable,
                prevLabel: '',
                nextLabel: '',
                perPage: 100,
              }"
            >
              <template slot="table-row" slot-scope="props">
                <div class="user-name-col" v-if="props.column.field === 'firstName'">
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
                  <span>{{ props.row.title }}</span>
                </div>
              </template>
            </vue-good-table>

            <div class="modal-tabs__content-tab-head pt-10">
              <div class="pt-10 pb-10 attendees-total" v-if="this.model.eventUsers">
                Total
                {{ this.attendeesCount + " (" + this.attendeesTicketsCount + ")" }}
              </div>
              <span
                class="cancel-mobile-only"
                @click="$store.dispatch('setActiveModal', null)"
              >
                Cancel
              </span>
              <span class="pc">
                <download-excel
                  :data="this.rowsParticipants"
                  :fields="this.exportData.json_fields"
                  :name="this.model.title + '-attendees.xls'"
                  class="c-button px-15 c-button--sm c-button--outline-info button-download-attendees"
                >
                  Download
                </download-excel>
              </span>
            </div>
          </div>

          <div
            class="modal-tabs__content-tab"
            v-if="this.model.id"
            :class="{ active: activeEditModalTab == 2 }"
          >
            <div class="pt-10 pb-10 qa-totals" v-if="this.model.eventUsers">
              Total {{ this.model.questionsAnswers.length }}
            </div>
            <!--QA TABLE-->
            <vue-good-table
              class="custom-table qa-table"
              :columns="columnsQA"
              :rows="rowsQA"
              :pagination-options="{
                enabled: tablesPaginationEnable,
                perPage: 4,
                prevLabel: '',
                nextLabel: '',
              }"
            >
              <template slot="table-row" slot-scope="props">
                <div
                  class="user-col p-20"
                  v-if="props.column.field === 'userphoto'"
                  :class="{ waitanswer: props.row.editable && !props.row.answer }"
                >
                  <div class="user-col__image mb-20">
                    <span class="qa-col__head-name" v-if="props.row.askedBy">
                      <span
                        v-if="props.row.askedBy.photo"
                        class="user-name-col__image desktop_img"
                      >
                        <img :src="props.row.askedBy.photo.url" alt="" />
                      </span>
                      <span v-else class="user-name-col__image">
                        <img
                          svg-inline
                          src="@/assets/svg/icon-user.svg"
                          height="30px"
                          width="30px"
                        />
                      </span>
                    </span>
                    <span class="qa-col__head-name" v-else>
                      <span class="user-name-col__image">
                        <img
                          svg-inline
                          src="@/assets/svg/icon-user.svg"
                          height="30px"
                          width="30px"
                        />
                      </span>
                    </span>
                  </div>
                  <c-button
                    variant="plain"
                    class="remove-btn"
                    tag="button"
                    style="display: none"
                  >
                    <img
                      svg-inline
                      src="@/assets/svg/trash.svg"
                      height="16px"
                      width="16px"
                    />
                  </c-button>
                </div>

                <div
                  class="qa-col"
                  v-if="props.column.field === 'questionsanswers'"
                  :class="[
                    !props.row.answer ? 'waitanswer' : '',
                    activeToggle === props.row.originalIndex ? 'is-active' : '',
                  ]"
                >
                  <div class="qa-col__head">
                    <span class="qa-col__head-name" v-if="props.row.askedBy">
                      <span class="qa-col__head-name__photo">
                        <span v-if="props.row.askedBy.photo" class="user-name-col__image">
                          <img :src="props.row.askedBy.photo.url" alt="" />
                        </span>
                        <span v-else class="user-name-col__image">
                          <img
                            svg-inline
                            src="@/assets/svg/icon-user.svg"
                            height="30px"
                            width="30px"
                          />
                        </span>
                      </span>
                      {{ props.row.askedBy.firstName + " " + props.row.askedBy.lastName }}
                    </span>
                    <span class="qa-col__head-name" v-else>
                      <span class="qa-col__head-name__photo">
                        <span class="user-name-col__image">
                          <img
                            svg-inline
                            src="@/assets/svg/icon-user.svg"
                            height="30px"
                            width="30px"
                          />
                        </span>
                      </span>
                    </span>
                    <span class="qa-col__head-time">
                      {{ props.row.createdOnUtc }}
                    </span>
                    <div
                      class="qa-col__head-toggle"
                      @click="toggleQA(props.row.originalIndex)"
                    >
                      <img svg-inline src="@/assets/svg/arrow-down.svg" />
                    </div>
                  </div>
                  <div class="qa-col__list">
                    <div class="qa-col__list-item">
                      <div class="question">
                        <div class="question__icon mr-15">
                          <img
                            svg-inline
                            src="@/assets/svg/icon-question.svg"
                            height="16px"
                            width="16px"
                          />
                        </div>
                        <div class="question__text">
                          {{ props.row.question }}
                          <div class="question__text__date">
                            {{ props.row.createdOnUtc }}
                          </div>
                        </div>
                      </div>
                      <div class="answer">
                        <div
                          class="answer__icon mr-15"
                          :class="{
                            waitanswer: props.row.editable && !props.row.answer,
                          }"
                        >
                          <img
                            svg-inline
                            src="@/assets/svg/icon-answer.svg"
                            height="16px"
                            width="16px"
                          />
                        </div>
                        <div class="answer__content w-100">
                          <article v-if="props.row.answer && !props.row.editable">
                            {{ props.row.answer }}
                            <c-button
                              variant="plain"
                              class="ml-5 edit-btn"
                              @click="toggleEditAnswer(props.row.id)"
                              tag="button"
                            >
                              <img
                                svg-inline
                                src="@/assets/svg/pencil.svg"
                                height="16px"
                                width="16px"
                              />
                            </c-button>
                          </article>
                          <form
                            v-if="props.row.editable"
                            class="w-100 form-answer"
                            @submit.prevent="
                              handleAnswerSubmit(props.row.id, props.row.originalIndex)
                            "
                          >
                            <input
                              placeholder="reply"
                              type="text"
                              name="field_answer"
                              v-model="
                                eventQuestionsAnswers[props.row.originalIndex].answer
                              "
                              required
                            />
                            <button type="submit">
                              <img
                                svg-inline
                                src="@/assets/svg/icon-send.svg"
                                height="17px"
                                width="17px"
                              />
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </vue-good-table>
            <span
              class="cancel-mobile-only"
              @click="$store.dispatch('setActiveModal', null)"
            >
              Cancel
            </span>
          </div>
        </div>
      </div>
    </div>
    <!--MODALS-->

    <transition name="fade" mode="out-in" v-if="settingsToggle">
      <c-event-setting-modal
        :type="editDialog"
        @save="createEvent"
        @cancel="settingsToggle = false"
      />
    </transition>
  </div>
</template>

<script>
import { VueGoodTable } from "vue-good-table";
import "vue-good-table/dist/vue-good-table.css";
import JsonExcel from "vue-json-excel";

export default {
  name: "newEvent",
  components: {
    "vue-good-table": VueGoodTable,
    downloadExcel: JsonExcel,
    "c-image-upload-simple": () => import("@/components/image-upload-simple"),
    "rich-editor": () => import("@/components/rich-editor"),

    /* -------------------------- event setting dialog -------------------------- */
    "c-event-setting-modal": () => import("@/components/modals/eventSetting"),
  },
  data() {
    return {
      isEdit: false,
      editDialog: true,
      settingsToggle: false,
      activeToggle: null,
      activeEditModalTab: 0,
      eventTabs: ["Details", "Attendees", "Q&A"],
      currentUserID: 0,
      waitingForAnswer: false,
      allowRichEditor: true,
      endDateChangedManually: false,
      model: {
        startDateTime: new Date(),
        endDateTime: new Date(),
        title: "",
        description: "",
        coverImage: "",
        price: "",
        location: "",
        groupId: "",
        isPublic: true,
        minAttendeesCount: "",
        maxAttendeesCount: "",
        recurrence: {
          name: "",
          value: "",
        },
        recurringData: {},
        meetingJoinUrl: null,
      },
      columnsParticipants: [
        {
          label: "Name",
          field: "firstName",
        },
        {
          label: "Email",
          field: "email",
        },
        {
          label: "Guests",
          field: "attendeesCount",
        },
      ],
      rowsParticipants: [],
      columnsQA: [
        {
          label: "",
          field: "userphoto",
        },
        {
          label: "",
          field: "questionsanswers",
        },
      ],
      rowsQA: [],
      eventQuestionsAnswers: "",
      cronIntervalsTypes: [
        { name: "Does not repeat", value: "0" },
        { name: "Daily", value: "1" },
        { name: "Weekly", value: "2" },
        { name: "Monthly", value: "3" },
        { name: "Every weekday (MON-FRI)", value: "4" },
      ],
      cronExpression: "",
      exportData: {
        json_fields: {
          Name: "firstName",
          Email: "email",
          Guests: "attendeesCount",
        },
        json_meta: [
          [
            {
              key: "charset",
              value: "utf-8",
            },
          ],
        ],
      },
      attendeesCount: 0,
      attendeesTicketsCount: 0,
      disabledBefore: new Date(),
      showPreload: true,
      uploadedImg: null,
      windowWidth: window.innerWidth,
      tablesPaginationEnable: true,
      startDateInvalid: false,
      endDateInvalid: false,
      editedImgURL: null,
      inputChenged: false,
      imageChenged: false,
    };
  },
  computed: {
    isDesktop() {
      return true;
    },
  },

  methods: {
    settingsToggleFun() {
      if (this.model.recurrence.value !== 0) {
        this.settingsToggle = true;
      } else {
        this.createEvent();
      }
    },
    async createEvent(val) {
      let datesAreValid = this.validateDateInputs();

      const valid = await this.$refs.eventObserver.validate();
      if (!valid) {
        return false;
      }

      if (!datesAreValid) {
        return false;
      }

      let url, text, method;
      if (this.model.id) {
        if (val) {
          url = ["EVENT_UPDATE_RECURRING", val];
        } else {
          url = "EVENT_UPDATE";
        }
        text = "Event has been updated!";
        method = "PUT";
      } else {
        url = "EVENT_CREATE";
        text = "Event has been created!";
        method = "POST";
        this.model.groupId = this.$route.params.id;
      }

      const startDate = this.$moment(this.model.startDateTime).format("MM/DD/YYYY HH:mm");
      const endDate = this.$moment(startDate).add(1, "years").format("MM/DD/YYYY HH:mm");

      const recurrenceType = parseInt(this.model.recurrence.value);

      if (recurrenceType !== 0) {
        this.model.recurringData = {
          cronExpression: this.cronExpression,
          fromDate: startDate,
          toDate: endDate,
          recurrenceType: recurrenceType,
          timezoneOffset: new Date().getTimezoneOffset(),
        };
      } else {
        this.model.recurringData = null;
      }

      this.setLoadingStatus(true);
      console.log(url + "?changeType=1");
      this.makeRequest(url, method, this.model).then((res) => {
        if (res.status === 200 && this.$route.params.id) {
          if (this.uploadedImg) {
            this.uploadEventPhoto(this.uploadedImg, res.data.id)
              .then(() => {
                this.loadGroup(this.$route.params.id).then((response) => {
                  if (response && response.status === 200) {
                    this.setLoadingStatus(false);
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
                this.setLoadingStatus(false);
                this.resolveError(error);
                this.loadEventInternal(res.data.id);
                this.uploadedImg = null;
                this.loadGroup(this.$route.params.id);
              });
          } else if (this.imageChenged) {
            const url = `/event/${this.model.id}/photo`;
            this.deleteImg(url, this.model).then((response) => {
              if (response && response.status === 200) {
                this.setLoadingStatus(false);
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
                this.setLoadingStatus(false);
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
        }
      });
    },
    loadEventInternal(id) {
      this.loadEvent(id).then((response) => {
        if (response && response.status === 200) {
          this.model = { ...response.data };
          this.model.startDateTime = new Date(
            this.$moment.utc(this.model.startDateTime).local().format()
          );
          this.model.endDateTime = new Date(
            this.$moment.utc(this.model.endDateTime).local().format()
          );

          if (this.model.recurringData) {
            const type = this.model.recurringData.recurrenceType;
            const recurrence = this.cronIntervalsTypes[type];
            this.cronExpression = this.model.recurringData.cronExpression;
            if (recurrence) this.model.recurrence = recurrence;
          } else {
            this.cronExpression = "";
            this.model.recurrence = this.cronIntervalsTypes[0];
          }

          this.loadEventParticipantsInternal(id);
          this.loadEventQAInternal(id);
          this.handleDates(this.model.startDateTime, this.model.endDateTime);

          this.showPreload = false;
          console.log(
            "loadEventInternal",
            this.model.id,
            this.model.occurenceIndex,
            this.model
          );
        }
      });
    },
    loadEventParticipantsInternal(id) {
      this.loadEventParticipants(id).then((response) => {
        if (response && response.status === 200) {
          let ticketsCount = 0;
          this.rowsParticipants = response.data.users.map((user) => {
            user.firstName = user.firstName + " " + user.lastName;
            ticketsCount += user.attendeesCount;
            return user;
          });

          this.attendeesCount = this.rowsParticipants.length;
          this.attendeesTicketsCount = ticketsCount;
        }
      });
    },
    loadEventQAInternal(id) {
      this.loadEventQA(id).then((response) => {
        if (response && response.status === 200) {
          this.eventQuestionsAnswers = response.data.questionAndAnswers.map((item) => {
            item.createdOnUtc = this.$moment(item.createdOnUtc).format(
              "MM/DD/YYYY HH:mm"
            );
            item.editable = false;
            if (!item.answer) {
              item.editable = true;
              this.waitingForAnswer = true;
            }
            return item;
          });

          this.rowsQA = [...this.eventQuestionsAnswers];
        }
      });
    },
    handleAnswerSubmit(questionID, rowID) {
      const data = {
        eventId: this.model.id,
        question: "",
        answer: this.eventQuestionsAnswers[rowID].answer,
        parentId: 0,
        occurenceIndex: 0,
        id: questionID,
        apiStatus: 0,
        apiMessage: "",
        createdOnUtc: new Date(),
        updatedOnUtc: new Date(),
        createdById: this.currentUserID,
        updatedById: this.currentUserID,
      };
      this.setLoadingStatus(true);

      this.makeRequest("PUT_EVENT_ANSWER", "PUT", data)
        .then((response) => {
          this.setLoadingStatus(false);
          if (response.status === 200 && this.$route.params.id) {
            this.toggleEditAnswer(questionID);
          }
        })
        .catch(() => {});
    },
    changePhoto(img) {
      this.imageChenged = true;
      this.editedImgURL = img;
      this.uploadedImg = null;
      this.uploadedImg = img;
    },
    uploadEventPhoto(img, eventID = null) {
      if (eventID) {
        const url = `/event/${eventID}/photo`;
        return this.uploadImgWithRezult(url, img);
      } else if (this.model.id) {
        const url = `/event/${this.model.id}/photo`;
        this.uploadImg(url, img).then((response) => {
          if (response && response.status === 200) {
            console.log("uploadEventPhoto", response.data);
            this.editedImgURL = response.data.url;
            this.model.photo = response.data;
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
    loadCurrentUserID() {
      this.loadCurrentUser().then((response) => {
        if (response && response.status === 200) {
          this.currentUserID = response.data.id;
        }
      });
    },
    toggleEditAnswer(id) {
      let noAnswer = false;
      this.eventQuestionsAnswers.forEach((qa, index) => {
        if (qa.id === id) {
          this.eventQuestionsAnswers[index].editable = !this.eventQuestionsAnswers[index]
            .editable;
        }
        if (!qa.answer) {
          noAnswer = true;
        }
      });
      this.waitingForAnswer = noAnswer;
      this.rowsQA = [...this.eventQuestionsAnswers];
    },
    auth() {
      this.setLoadingStatus(true);
      this.makeRequest("ZOOM_AUTH", "GET").then((data) => {
        if (data.status === 200) {
          this.setLoadingStatus(false);
          window.location.replace(data.data, "_blank");
        }
      });
    },
    zoomActivate() {
      console.log("zoom");
      this.auth();
    },
    handleZoomClick() {
      this.model.meetingJoinUrl ? this.cancelMeeting() : this.createMeeting();
    },
    createMeeting() {
      this.makeRequest("MEETING_CREATE", "POST", null, this.model.id).then((result) => {
        console.log("ZOOM", result);
        if (result.status === 200) {
          if (result.data.uuid) {
            this.setLoadingStatus(false);
            this.$notify({
              group: "system",
              title: "Great!",
              text: "Zoom meeting created!",
              type: "success",
            });
            this.model.meetingJoinUrl = result.data.joinUrl;
          } else {
            // auth
            const authSuccess = this.zoomAuth();
            if (authSuccess) {
              this.createMeeting();
            }
          }
        } else {
          this.$notify({
            group: "system",
            title: "Unauthorized",
            text: "Please, connect Zoom in profile page!",
            type: "error",
          });
        }
      });
    },
    cancelMeeting() {
      this.$confirm({
        title: "Are you sure?",
        message: `You'd like to delete this Zoom conference!`,
        button: {
          no: "No",
          yes: "Cancel",
        },
        callback: (confirm) => {
          if (confirm) {
            this.makeRequest("MEETING_DELETE", "DELETE", null, this.model.id).then(
              (data) => {
                if (data.status === 200) {
                  this.setLoadingStatus(false);
                  this.$notify({
                    group: "system",
                    title: "Great!",
                    text: "Zoom meeting canceled!",
                    type: "success",
                  });
                  this.model.meetingJoinUrl = null;
                }
              }
            );
          }
        },
      });
    },
    zoomAuth() {
      console.log("zz");
      this.setLoadingStatus(true);
      return new Promise((resolve, reject) => {
        this.makeRequest("ZOOM_AUTH", "GET").then((data) => {
          if (data.status === 200) {
            this.setLoadingStatus(false);
            window.location.replace(data.data, "_blank");
            resolve();
          } else {
            reject();
          }
        });
      });
    },
    handleDates(startDate, endDate) {
      this.eventDateInterval = endDate - startDate;
    },
    handeEventEndDateChange() {
      this.inputChenged = true;
      this.endDateChangedManually = true;
      if (this.validateDateInputs()) {
        this.handleDates(this.model.startDateTime, this.model.endDateTime);
      }
      this.validateDateInputs();
    },
    setEventEndDate() {
      this.inputChenged = true;
      if (!this.endDateChangedManually && !this.model.id) {
        this.model.endDateTime = new Date(
          this.$moment(this.model.startDateTime).add(1, "hours").format()
        );
      } else {
        this.model.endDateTime = new Date(
          this.$moment(this.model.startDateTime)
            .add(this.eventDateInterval, "milliseconds")
            .format()
        );
      }
      this.validateDateInputs();
    },
    disableDate(date) {
      const startDate = this.model.startDateTime;
      return (
        startDate && date.setHours(0, 0, 0, 0) < new Date(startDate).setHours(0, 0, 0, 0)
      );
    },
    disableTime(date) {
      const startDate = this.model.startDateTime;
      return startDate && date < startDate;
    },
    disableStartDate(date) {
      let disable = false;

      const startDate = this.model.startDateTime;
      const now = new Date();

      if (
        startDate &&
        date.setHours(0, 0, 0, 0) < new Date(startDate).setHours(0, 0, 0, 0)
      ) {
        //disable = true;
      }

      if (now.setHours(0, 0, 0, 0) > date) {
        disable = true;
      }

      if (!this.model.id) {
        // DISABLE ALL DATES THAT GREATER CURRENT DATE + 30 DAYS FOR THE NEW EVENT
        if (startDate && date.setHours(0, 0, 0, 0) > now.setDate(now.getDate() + 30)) {
          disable = true;
        }
      } else {
        // DISABLE ALL DATES THAT GREATER START DATE + 30 DAYS
        if (startDate && date.setHours(0, 0, 0, 0) > date.setDate(date.getDate() + 30)) {
          disable = true;
        }
      }

      return disable;
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
      if (this.windowWidth > 767) {
        this.tablesPaginationEnable = true;
      }
    },
    toggleQA(index) {
      if (this.activeToggle === index) {
        this.activeToggle = null;
      } else {
        this.activeToggle = index;
      }
    },
    validateDateInputs() {
      let isValidInputs = false;

      const startDate = this.$moment(this.model.startDateTime).format("MM/DD/YYYY HH:mm");
      const endDate = this.$moment(this.model.endDateTime).format("MM/DD/YYYY HH:mm");

      this.startDateInvalid = !this.$moment(startDate).isValid();
      this.endDateInvalid = !this.$moment(endDate).isValid();

      if (this.$moment(startDate).isValid() && this.$moment(endDate).isValid()) {
        isValidInputs = true;
      }

      return isValidInputs;
    },
    copyZoomLinkToClipboard() {
      navigator.clipboard.writeText(this.model.meetingJoinUrl);
      this.$notify({
        group: "system",
        title: "Great!",
        text: "Meeting link copied successfully!",
        type: "success",
      });
    },
    isFormChange(invalid, dirty) {
      return !(invalid || dirty || this.inputChenged || this.imageChenged);
    },
  },

  mounted() {
    var event = this.$store.getters.getEvent;
    if (event && event.id) {
      this.showPreload = true;
      this.loadEventInternal(event.id);
      this.loadCurrentUserID();

      if (this.windowWidth < 767) {
        this.tablesPaginationEnable = true;
      }
    } else {
      this.showPreload = false;
      this.model.recurrence = this.cronIntervalsTypes[0];
      this.setEventEndDate();
    }
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    this.$store.dispatch("setActiveModal", null);
    this.$store.dispatch("setCurrentEvent", null);
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>

<style lang="scss">
@import "./../../style/components/modals/_new-event.scss";
@media only screen and (max-width: 768px) {
  .desktop_img {
    display: none !important;
  }
  				// .modal-opened .modal{
					// 	overflow-y: hidden !important;
					// }
}
</style>
