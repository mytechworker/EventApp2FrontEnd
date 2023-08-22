<template>
  <div class="public-group">
      <!-- >>{{model}}
      >>>{{pageError}} -->
    <div class="public-group__error" v-if="pageError">
      <div class="public-container">
      
        <img svg-inline src="@/assets/svg/icon-danger.svg"/>
        Link Expired or Invalid
      </div>
    </div>
    <div class="public-group__header">
      <div class="public-container">
        <img src="@/assets/logo-dark.svg" alt="logo">
      </div>
    </div>
    <div class="public-group__page">
      <div class="public-group__title">
        <h1 v-if="model.id">{{ model.title }}</h1>
        <c-button variant="outline-info"
                  tag="button"
                  size="sm"
                  class="btn-scroll"
                  v-if="!pageError"
                  @click="scrollToForm">
          <img svg-inline src="@/assets/svg/icon-join.svg"/>
          Join the group
          <span class="btn-scroll-arrow">
            <img svg-inline src="@/assets/svg/icon-scroll.svg"/>
          </span>
        </c-button>
        <span v-else class="btn-invalid">
          <img svg-inline src="@/assets/svg/icon-error.svg"/>
          LINK EXPIRED OR INVALID
        </span>
        <div class="public-group__title-quotes">
          <img src="@/assets/svg/join-quotes.svg" alt="quotes">
        </div>
      </div>
      <div class="public-group__content">
        <div class="public-container">
          <div class="public-group__content-info group-info">
            <div class="group-info__image" v-if="model.id">
              <img :src="model.photo.url" :alt="model.title">
            </div>
            <div class="group-info__image" v-else>
              <img class="preload-image" svg-inline src="@/assets/svg/loader.svg" height="60px" width="60px"/>
            </div>
            <div class="group-info__details">
              <div class="group-info__details-list">

                <div class="details-item">
                  <div class="details-item__icon">
                    <img svg-inline src="@/assets/svg/icon-people.svg"/>
                  </div>
                  <div class="details-item__text" v-if="model.id">
                    <strong>{{ model.membersCount }}</strong>
                    <p>Members</p>
                  </div>
                </div>

                <div class="details-item" v-if="model.id && model.administrators.length">
                  <div class="details-item__icon">
                    <img svg-inline src="@/assets/svg/icon-config.svg"/>
                  </div>
                  <div class="details-item__text administrators">
                    <template v-if="model.administrators.length > 2">
                      <strong>{{ model.administrators[0].title }}</strong>
                      <strong>{{ model.administrators[1].title }}</strong>
                      <span class="admins-counter" v-tooltip="{
                        content: administratorsString,
                        html: true
                      }">+{{ model.administrators.length - 2 }}</span>
                    </template>
                    <template v-else>
                      <strong v-for="(administrator, i) of model.administrators "
                              :key="i">{{ administrator.title }}</strong>
                    </template>
                    <p>Administrator</p>
                  </div>
                </div>

                <div class="details-item" v-if="model.website">
                  <div class="details-item__icon">
                    <img svg-inline src="@/assets/svg/icon-web.svg"/>
                  </div>
                  <div class="details-item__text">
                    <strong>
                      <a :href="model.website" target="_blank">
                        {{ model.website }}
                      </a>
                    </strong>
                    <p>Website</p>
                  </div>
                </div>

                <div class="details-item" v-if="model.email">
                  <div class="details-item__icon">
                    <img svg-inline src="@/assets/svg/icon-mail.svg"/>
                  </div>
                  <div class="details-item__text">
                    <strong>
                      <a :href="'mailto:'+model.email">
                        {{ model.email }}
                      </a>
                    </strong>
                    <p>Email</p>
                  </div>
                </div>

                <div class="details-item" v-if="model.phone">
                  <div class="details-item__icon">
                    <img svg-inline src="@/assets/svg/icon-phone.svg"/>
                  </div>
                  <div class="details-item__text">
                    <strong>{{ model.phone }}</strong>
                    <p>Phone</p>
                  </div>
                </div>

              </div>
              <div class="group-info__details-socials">
                <a :href="model.facebook" target="_blank" class="group-info__details-socials-item"
                   v-if="model.facebook">
                  <img svg-inline src="@/assets/svg/icon-facebook.svg"/>
                </a>
                <a :href="model.instagram" target="_blank" class="group-info__details-socials-item"
                   v-if="model.instagram">
                  <img svg-inline src="@/assets/svg/icon-insta.svg"/>
                </a>
                <a :href="model.youtube" target="_blank" class="group-info__details-socials-item" v-if="model.youtube">
                  <img svg-inline src="@/assets/svg/icon-youtube.svg"/>
                </a>
              </div>
            </div>
          </div>
          <div class="public-group__content-description group-description">
            <div class="group-description__title">
              Description
            </div>
            <div class="group-description__article" v-if="model.description">
              <template v-if="model.description.length > 400">
                <div v-if="!showFullDescription">
                  {{ model.description.slice(0, 400) + ' ...' }}
                </div>
                <div v-else>
                  {{ model.description }}
                </div>
                <div>
                  <span class="read-more" @click="showFullDescription = !showFullDescription">
                    {{ showFullDescription ? 'Read less' : 'Read more' }}
                  </span>
                </div>
              </template>
              <template v-else>
                {{ model.description }}
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="public-group__information">
        <div class="public-container">
          <div class="public-group__information-title" v-if="model.id">
            <strong>{{ model.title }}</strong> is a private community space where you can
          </div>
          <div class="public-group__information-carousel">
            <swiper ref="mySwiper" :options="swiperOptions">
              <swiper-slide>
                <div class="advantage-item">
                  <div class="advantage-item__icon">
                    <img src="@/assets/svg/icon-search.svg" alt="icon-search">
                  </div>
                  <div class="advantage-item__text">
                    <strong>Discover</strong>
                    <p>The things you love to do within Parishioners</p>
                  </div>
                </div>
              </swiper-slide>
              <swiper-slide>
                <div class="advantage-item">
                  <div class="advantage-item__icon">
                    <img src="@/assets/svg/icon-explore.svg" alt="icon-explore">
                  </div>
                  <div class="advantage-item__text">
                    <strong>Explore</strong>
                    <p>Events and stay in the know</p>
                  </div>
                </div>
              </swiper-slide>
              <swiper-slide>
                <div class="advantage-item">
                  <div class="advantage-item__icon">
                    <img src="@/assets/svg/icon-save.svg" alt="icon-save">
                  </div>
                  <div class="advantage-item__text">
                    <strong>Save</strong>
                    <p>Events you’re interested in and revisit them later</p>
                  </div>
                </div>
              </swiper-slide>
              <swiper-slide>
                <div class="advantage-item">
                  <div class="advantage-item__icon">
                    <img src="@/assets/svg/icon-have.svg" alt="icon-have">
                  </div>
                  <div class="advantage-item__text">
                    <strong>Have</strong>
                    <p>Discussions and ask questions to the organizers</p>
                  </div>
                </div>
              </swiper-slide>
              <swiper-slide>
                <div class="advantage-item">
                  <div class="advantage-item__icon">
                    <img src="@/assets/svg/icon-get.svg" alt="icon-get">
                  </div>
                  <div class="advantage-item__text">
                    <strong>Get</strong>
                    <p>RSVP, Passes and Checkout for events</p>
                  </div>
                </div>
              </swiper-slide>
              <swiper-slide>
                <div class="advantage-item">
                  <div class="advantage-item__icon">
                    <img src="@/assets/svg/icon-check.svg" alt="icon-check">
                  </div>
                  <div class="advantage-item__text">
                    <strong>Checkin</strong>
                    <p>Into the events directly from the App</p>
                  </div>
                </div>
              </swiper-slide>
              <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
            <div class="swiper-button-prev" slot="button-prev">
              <img svg-inline src="@/assets/svg/icon-arrow-right.svg"/>
            </div>
            <div class="swiper-button-next" slot="button-next">
              <img svg-inline src="@/assets/svg/icon-arrow-right.svg"/>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!pageError" class="public-group__form" id="joinform">

        <div class="public-container">
          <div class="public-group__form-container" v-if="!formSend">
            <h2 v-if="model.id">Join {{ model.title }}</h2>
            <h4>Fill out the form below in order to request to join the group</h4>
            <ValidationObserver tag="div" class="form-wrap" v-slot="{ invalid }">

              <div class="form-row">
                <div class="form-row__column input-wrapper">
                  <label>You first name *</label>
                  <c-input v-model="form.firstName" name="Firstname" :rules="{required: true}"/>
                </div>
                <div class="form-row__column input-wrapper">
                  <label>Your last name *</label>
                  <c-input v-model="form.lastName" name="Lastname" :rules="{required: true}"/>
                </div>
              </div>

              <div class="input-wrapper">
                <label>Your email *</label>
                <c-input v-model="form.email" name="Email" :rules="{required: true, email: true, type: 'eager'}"/>
              </div>

              <div class="input-wrapper">
                <label>Message to the group’s organizers</label>
                <c-textarea class="w-100" v-model="model.message" :rules="{required: false}"/>
              </div>

              <div class="btn-container">
                <p>* mandatory fields</p>
                <c-button variant="info"
                          tag="button"
                          size="sm"
                          :disabled="invalid"
                          @click="joinPublicGroup"
                          class="btn-submit">
                  Send
                </c-button>
              </div>
            </ValidationObserver>
          </div>
          <div class="public-group__form-container" v-else>
            <h2 v-if="model.id">Join {{ model.title }}</h2>
            <div class="public-group__form-image">
              <img src="@/assets/svg/icon-form-sent.svg" alt="form sent">
            </div>
            <div class="public-group__form-message">
              Your request has been sent successfully.
            </div>
          </div>
        </div>

        <div class="public-group__form-quotes">
          <img src="@/assets/svg/join-quotes.svg" alt="quotes">
        </div>

        <div class="public-group__form-quotes-small">
          <img src="@/assets/svg/join-quotes.svg" alt="quotes">
        </div>
      </div>
      <div v-else class="page-error">
        <div class="public-container">
          <div class="page-error__image">
            <img src="@/assets/svg/dog-error.svg" alt="error">
          </div>
          <div class="page-error__title">
            Link Expired or Invalid
          </div>
          <div class="page-error__text">
            You can’t join in because link is expired or invalid.
          </div>
        </div>

        <div class="page-error-quotes">
          <img src="@/assets/svg/join-quotes.svg" alt="quotes">
        </div>

        <div class="page-error-quotes-small">
          <img src="@/assets/svg/join-quotes.svg" alt="quotes">
        </div>
      </div>
    </div>
    <div class="public-group__footer">
      <div class="public-container">
        <ul>
          <li><a href="https://www.youtooapp.com/privacy-policy/" target="_blank">Privacy notice</a></li>
          <li><a href="https://www.youtooapp.com/terms-of-service/" target="_blank">Conditions of Use</a></li>
          <li><a href="https://www.youtooapp.com/" target="_blank">About us</a></li>
        </ul>
        <div class="madeby">
          Made with <img src="@/assets/svg/icon-heart.svg" alt="heart"> by
          <a href="https://www.nismansolutions.com/" target="_blank">Nisman Solutions</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {Swiper, SwiperSlide} from 'vue-awesome-swiper';
import 'swiper/swiper-bundle.css';

export default {
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      model: {
        id: null,
        title: null,
        description: null,
        membersCount: null,
        website: null,
        administrators: null,
        facebook: null,
        email: null,
        instagram: null,
        youtube: null,
        photo: null
      },
      form: {
        firstName: '',
        lastName: '',
        email: '',
        message: ''
      },
      swiperOptions: {
        loop: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true
        },
        breakpoints: {
          320: {
            slidesPerView: 1,
          },
          790: {
            slidesPerView: 2,
          },
          1100: {
            slidesPerView: 3,
          }
        }
      },
      formSend: false,
      pageError: false,
      showFullDescription: false,
      administratorsString: ''
    }
  },
  methods: {
    setAdministratorsSting(administrators) {
      const adminsCount = administrators.length;
      let i = 0;
      administrators.map(admin => {
        i++;
        const add = (adminsCount === i) ? '' : ', ';
        this.administratorsString += admin.title + add;
      });
    },
    loadPublicGroup() {
      console.log("loadPublicGroup")
      let url = ['PUBLIC_GROUP_GET_INFO', this.$route.params.id];
      this.makeRequest(url, 'GET', null, this.$route.params.id)
          .then((res) => {
            if (res.status === 200) {
              this.model = {...res.data};
              this.setAdministratorsSting(res.data.administrators);
            }
          })

      const data = {
        userEmail: 'testemail@test.com',
        firstName: '',
        lastName: '',
        description: '',
        code: this.$route.params.code,
        groupId: this.$route.params.id,
        isValidateOnly: true,
      }

      this.makeRequest('GROUP_JOIN', 'POST', data)
          .then((res) => {
            if (res.status !== 200) {
              this.pageError = true;
            }
          })
          .catch(() => {
            this.pageError = true;
          });
    },
    joinPublicGroup() {

      const data = {
        userEmail: this.form.email,
        firstName: this.form.firstName,
        lastName: this.form.lastName,
        description: this.form.message ? this.form.message : '',
        code: this.$route.params.code,
        groupId: this.$route.params.id,
        isValidateOnly: false,
      }

      this.makeAnonRequest('GROUP_JOIN', 'POST', data)
          .then(res => {
            if (res.status === 200) {
              this.formSend = true;


            }
          }).catch(error => {
        console.log('error', error);
      });

    },
    scrollToForm() {
      const element = document.getElementById('joinform');
      element.scrollIntoView({behavior: "smooth"});
    },
  },
  mounted() {
    // LOAD GROUP
    this.loadPublicGroup();
  }
}
</script>

<style lang="scss">
@import "./../../style/_public-group.scss";
</style>