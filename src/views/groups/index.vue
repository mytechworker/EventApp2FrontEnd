<template>
  <div>
    <div class="groups">
      <div class="groups__title d-flex w-100 align-center">
        <div class="h2 desktop_title">Groups</div>
        <!--BUTTON ADD GROUP-->
        <div class="header_spacer d-flex align-center justify-space-between">
          <div class="group-search">
            <form v-on:submit.prevent="search">
              <div class="group-search__input">
                <span class="input__icon"><div class="magnifying-glass"></div></span>
                <input
                  type="text"
                  placeholder="Search"
                  v-model="searchOptions.text"
                  class=""
                />
              </div>
              <div class="group-search__actions vgt-pull-right"></div>
            </form>
          </div>
          <c-button
            tag="button"
            variant="info"
            size="sm"
            @click="$store.dispatch('setActiveModal', 'group')"
          >
            Add Group
          </c-button>
        </div>
      </div>

      <!--GROUPS TABLE-->
      <div class="groups-list" v-if="getGroups[0] && getGroups[0].groups.length > 0">
        <div
          class="groups-list__item"
          v-for="group in getGroups[0].groups"
          :key="group.id"
        >
          <router-link
            tag="div"
            :to="{ name: 'GroupSingle', params: { id: group.id } }"
            class="group-card"
          >
            <div class="group-card__title px-20 fw-500">
              {{ group.title }}
            </div>
            <!--IMAGE-->
            <div class="group-card__image">
              <img :src="group.photo.url" v-if="group.photo" />
              <img src="@/assets/img/group.png" v-else />
            </div>
            <!--MEMBERS-->
            <div
              class="group-card__action p-20 d-flex justify-content-between align-center"
            >
              <c-button tag="button" variant="plain" size="sm">
                <img svg-inline src="@/assets/svg/icon-external.svg" alt="icon" />
              </c-button>
              <c-button
                class="group-card__action-members"
                tag="button"
                variant="plain"
                size="sm"
              >
                {{ group.usersCount }} members
              </c-button>
            </div>
          </router-link>
        </div>

        <!--GROUPS HELP-->

        <div class="groups-list__item chat-card" v-if="openHelpChat">
          <div class="group-card">
            <div class="chat">
              <div class="chat__avatar">
                <img src="@/assets/img/chat-avatar.png" alt="" />
                <span class="chat__online"></span>
              </div>
              <div>
                <p class="chat__title">Need help?</p>
                <p class="chat__text">Get help and make the most of YouToo</p>
              </div>

              <div
                class="group-card__action p-20 d-flex justify-content-between align-center"
              >
                <c-button
                  tag="button"
                  @click="openHelpChat = false"
                  class="chat__button chat__dismiss"
                  variant="outline-info"
                  size="sm"
                >
                  Dismiss
                </c-button>
                <c-button
                  tag="a"
                  :href="linkLetsChat"
                  target="_blank"
                  class="chat__button"
                  variant="info"
                  size="sm"
                >
                  Let’s chat
                </c-button>
              </div>
              <img class="chat__bg1" src="@/assets/svg/chat-block-bg.svg" alt="" />
              <img class="chat__bg2" src="@/assets/svg/chat-block-bg2.svg" alt="" />
            </div>
          </div>
        </div>
      </div>

      <div class="no-groups" v-else>
        <img src="@/assets/svg/sad.svg" />
        You don't have groups yet :(
      </div>

      <!--GROUPS PAGINATE-->
      <div
        class="paginate-holder"
        v-if="getGroups[0].pageItemsCount > getGroups[0].pageSize"
      >
        <div>
          <div
            @click="paginatePrevFun(getGroups[0].page)"
            class="paginate_prev"
            :class="{ show_cursor: getGroups[0].page >= 2 }"
          >
            <svg
              width="8"
              height="14"
              viewBox="0 0 8 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                id="arrow"
                d="M7.70711 13.7071C7.34662 14.0676 6.77939 14.0953 6.3871 13.7903L6.29289 13.7071L0.292893 7.70711C-0.0675907 7.34662 -0.0953207 6.77939 0.209704 6.3871L0.292893 6.29289L6.29289 0.292893C6.68342 -0.0976305 7.31658 -0.0976305 7.70711 0.292893C8.06759 0.653378 8.09532 1.22061 7.7903 1.6129L7.70711 1.70711L2.415 7L7.70711 12.2929C8.06759 12.6534 8.09532 13.2206 7.7903 13.6129L7.70711 13.7071Z"
                fill="#909DB1"
              />
            </svg>
          </div>
          <h3 class="paginate_text">
            <span class="font-bold">{{ startitem }}</span> - {{ enditem }} of
            {{ getGroups[0].pageItemsCount }}
          </h3>
          <div
            @click="paginateNextFun(getGroups[0].page)"
            class="paginate_next"
            :class="{ show_cursor: getGroups[0].page != totalPages }"
          >
            <svg
              width="8"
              height="14"
              viewBox="0 0 8 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                id="arrow"
                d="M0.292893 0.292893C0.653377 -0.0675907 1.22061 -0.0953203 1.6129 0.209705L1.70711 0.292893L7.70711 6.29289C8.06759 6.65338 8.09532 7.22061 7.7903 7.6129L7.70711 7.70711L1.70711 13.7071C1.31658 14.0976 0.683418 14.0976 0.292893 13.7071C-0.0675907 13.3466 -0.0953203 12.7794 0.209705 12.3871L0.292893 12.2929L5.585 7L0.292893 1.70711C-0.0675907 1.34662 -0.0953203 0.779392 0.209705 0.387101L0.292893 0.292893Z"
                fill="#909DB1"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import urls from "@/common/urls";

export default {
  data() {
    return {
      linkLetsChat: urls.LINK_LETS_CHAT,
      openHelpChat: true,
      page: 1,
      searchOptions: {
        text: "",
      },
    };
  },
  components: {},
  computed: {
    ...mapGetters(["getGroups"]),
    totalPages() {
      return Math.ceil(this.getGroups[0].pageItemsCount / this.getGroups[0].pageSize);
    },
    //     start = (page - 1) * page_size + 1
    // end = Min(page * page_size , page_item_count)
    startitem() {
      return (this.getGroups[0].page - 1) * this.getGroups[0].pageSize + 1;
    },
    enditem() {
      if (this.getGroups[0].page === 1) {
        return this.getGroups[0].pageSize;
      } else {
        return Math.min(
          this.getGroups[0].pageItemsCount,
          this.getGroups[0].page * this.getGroups[0].pageSize
        );
      }
    },
  },
  watch: {
    "searchOptions.text": function () {
      if (this.searchOptions.text.length === 0) {
        this.$store.dispatch("searchGroup");
      }
    },
  },
  mounted() {
    this.$store.dispatch("searchGroup");
  },
  methods: {
    paginatePrevFun(val) {
      const page = val - 1;
      if (val >= 2) {
        let options = {
          text: this.search,
          page: page,
          pageSize: this.getGroups[0].pageSize,
        };
        this.$store.dispatch("searchGroup", options);
      }
    },
    paginateNextFun(val) {
      const page = val + 1;
      if (val < this.totalPages) {
        let options = {
          text: this.search,
          page: page,
          pageSize: this.getGroups[0].pageSize,
        };
        this.$store.dispatch("searchGroup", options);
      }
    },
    search() {
      if (this.searchOptions.text.length !== 0) {
        this.setLoadingStatus(true);
        this.makeRequest("SEARCH_GROUPS", "POST", this.searchOptions).then((resp) => {
          this.setGroups([resp.data]);
          this.setLoadingStatus(false);
        });
      } else {
        this.$store.dispatch("searchGroup");
      }
    },
  },
};
</script>

<style lang="scss">
@import "./../../style/_groops.scss";
.header_spacer {
  margin-left: auto;
}
.chat__text {
  padding: 0 24px;
}
.paginate-holder {
  margin-top: 100px;
}
ul.VuePagination {
  display: flex;
  list-style: none;
  align-items: center;
  justify-content: center;
  padding-left: 0px;

  li:first-child {
    margin-right: 18px;
    a {
      border-radius: 3px;
      background: #e9f2ff;
      padding: 10px 18px;
    }
  }
  li.page-item {
    a {
      background: #e9f2ff;
      padding: 10px 18px;
    }
  }
  li:last-child {
    margin-left: 18px;
    a {
      border-radius: 3px;
      background: #e9f2ff;
      padding: 10px 18px;
    }
  }
}

.group-search {
  margin: 0 15px 0 0;
  background: transparent;
  border: none;
  width: 180px;
  float: right;
  padding: 0;
  box-shadow: none;
  background: #fafbfd;
  border: 1px solid #c7cdd8;
  border-radius: 3px;

  &__input {
    padding-left: 6px;

    .input__icon {
      display: none;
    }

    input {
      background: url("~@/assets/svg/search.svg") right 10px center;
      background-size: 13px;
      background-repeat: no-repeat;
      height: 35px;
    }
  }

  &__actions {
    display: none;
  }
}

/* pagination css */
.paginate-holder {
  margin-top: 50px;
  display: flex;
  justify-content: center;
  margin-bottom: 17px;
  div {
    // flex items-center
    display: flex;
    align-items: center;
    .paginate_prev {
      width: 38px;
      height: 38px;
      background-color: #e9f2ff;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 3px;
    }
    .paginate_text {
      background-color: #e9f2ff;
      padding: 10px 18px;
      text-align: center;
      line-height: 18px;
      margin: 0 18px;
    }
    .paginate_next {
      width: 38px;
      height: 38px;
      background-color: #e9f2ff;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 3px;
    }
  }
  .show_cursor {
    cursor: pointer;
  }
}

@media (max-width: 425px) {
  .desktop_title {
    display: none;
  }
  .group-search {
    margin: 0;
  }
  .groups__title.d-flex.w-100.align-center {
    width: 100%;
    .header_spacer {
      width: 100%;
      .group-search {
        width: 100%;
      }
    }
  }
}
@media (min-width: 1450px) {
  .groups-list .group-card {
    height: 100%;
    .group-card__action.p-20.d-flex.justify-content-between.align-center {
      padding-top: 46px !important;
    }
  }
}
</style>
