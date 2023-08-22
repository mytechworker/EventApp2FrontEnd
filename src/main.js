import Vue from 'vue';
import App from './App.vue';
// import './registerServiceWorker';
import router from './router';
import store from './store';
import { mapGetters, mapMutations } from "vuex";
import VueCookies from 'vue-cookies'
import Notifications from 'vue-notification';
import VueSweetalert2 from 'vue-sweetalert2';
import axios from 'axios';
import firebase from "firebase/app";
import urls, { NON_SIMPLE_URL } from "./common/urls";
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
import DatePicker from 'vue2-datepicker';
import vSelect from "vue-select";
import VTooltip from 'v-tooltip';
import VueLocalStorage from 'vue-localstorage';
import VueConfirmDialog from 'vue-confirm-dialog';
import Paginate from 'vuejs-paginate'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueCarousel from 'vue-carousel';
import { Swiper as SwiperClass, Pagination, Navigation, Mousewheel, Autoplay } from 'swiper/swiper.esm'
SwiperClass.use([Pagination, Mousewheel, Navigation, Autoplay])

import 'sweetalert2/dist/sweetalert2.min.css';
import 'vue2-datepicker/index.css';
import "vue-select/dist/vue-select.css";
/* ----------------------------- audio recorder ----------------------------- */

import VueRecord from '@codekraft-studio/vue-record'


Vue.config.productionTip = false;

Vue.use(VueCookies);
Vue.use(Notifications);
Vue.use(VueRecord)
Vue.use(VueSweetalert2);
Vue.use(VueCarousel);
Vue.use(require('vue-moment'));
Vue.use(VTooltip, {
    defaultBoundariesElement: document.body
});
Vue.use(VueLocalStorage);
Vue.use(VueConfirmDialog);
Vue.use(VueAwesomeSwiper);
let FIREBASE_CONFIG;
let ID_FIREBASE_PROJECT;

if (window.FB_CONFIG) {
    FIREBASE_CONFIG = window.FB_CONFIG;
} else {
    ID_FIREBASE_PROJECT = "eventapp2-dev";
    FIREBASE_CONFIG = {
        apiKey: 'AIzaSyCYqNzSSWj8ATSIkVOfNlUGi-HJz8O_XIA',
        authDomain: ID_FIREBASE_PROJECT + '.firebaseapp.com',
        databaseURL: 'https://' + ID_FIREBASE_PROJECT + '.firebaseio.com',
        projectId: ID_FIREBASE_PROJECT,
        storageBucket: "eventapp2-dev.appspot.com",
        messagingSenderId: "1074560571174",
        appId: "1:1074560571174:web:be078fd8fc3d1f4f8693e7",
        measurementId: "G-FK104DWNRL"
    }
}

Vue.directive('scroll', {
    inserted: function (el, binding) {
        let f = function (evt) {
            if (binding.value(evt, el)) {
                window.removeEventListener('scroll', f)
            }
        };
        window.addEventListener('scroll', f)
    }
})

firebase.initializeApp(FIREBASE_CONFIG);

Vue.component("c-button", () => import("./components/button"));
Vue.component("c-input", () => import("./components/input"));
Vue.component("c-textarea", () => import("./components/textarea"));
Vue.component("c-checkbox", () => import("./components/checkbox"));
Vue.component("c-select", () => import("./components/select"));
Vue.component("c-form-group", () => import("./components/form-group"));

Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('DatePicker', DatePicker);
Vue.component('v-select', vSelect);
Vue.component('vue-confirm-dialog', VueConfirmDialog.default);
Vue.component('paginate', Paginate)
Object.keys(rules).forEach(rule => {
    extend(rule, rules[rule]);
});

Vue.prototype.$http = axios.create({
    baseURL: urls.BASE_API_URL
});

/* ------ REFRESH TOKEN ------ */
let isRefreshing = false;
let refreshSubscribers = [];

Vue.prototype.$http.interceptors.response.use(response => {
    console.log('no error Vue.prototype.$http.interceptors', isRefreshing);
    return response;
}, error => {
    const { config, response: { status } } = error;
    const originalRequest = config;
    if (status === 401) {
        console.log('401 inside Vue.prototype.$http.interceptors');
        if (!isRefreshing) {
            console.log('!isRefreshing');
            isRefreshing = true;
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    console.log('has user');
                    firebase.auth().currentUser.getIdToken(true)  // forceRefresh
                        .then(async (response) => {
                            console.log('after force refresh token', 'response', response);
                            Vue.$cookies.set("userEventAppToken", response);
                            isRefreshing = false;
                            onRrefreshed(Vue.$cookies.get('userEventAppToken'));
                        })
                        .catch((e) => console.log('Tried to refresh token', e))
                } else {
                    console.log('user', firebase.auth().currentUser);
                    console.log('else');
                    store.dispatch('userLogout');
                }
            });
        }

        return new Promise((resolve) => {
            console.log('subscribeTokenRefresh Promise inside');
            subscribeTokenRefresh(token => {
                // replace the expired token and retry
                originalRequest.headers['Authorization'] = 'Bearer ' + token;
                console.log('subscribeTokenRefresh originalRequest');
                resolve(axios(originalRequest));
            });
        });
    } else {
        console.log('not 401, reject');
        return Promise.reject(error);
    }
});
const subscribeTokenRefresh = (cb) => {
    console.log('subscribeTokenRefresh', cb);
    refreshSubscribers.push(cb);
}
const onRrefreshed = (token) => {
    console.log('onRrefreshed', token);
    refreshSubscribers.map(cb => cb(token));
    refreshSubscribers = [];
}
/* ------ REFRESH TOKEN ------ */


router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    let token = Vue.$cookies.get("userEventAppToken");

    if (requiresAuth) {
        token ? next() : next(`/signin`);
    } else {
        next();
    }
});



Vue.mixin({
    computed: mapGetters([
        "getLoadingStatus", "getCurrentUser", "getActiveModal", "getActiveSidebar", "getGroup", "getNotifications", "getUsers", "getGenerateJoinLinkModalStatus", "getActivePage"
    ]),
    methods: {
        ...mapMutations([
            "setLoadingStatus", "setCurrentUser", "setGroups", "setGroup", "setNotifications", "setEvent", "setPost", "setGenerateJoinLinkModalStatus", "setActivePage"]),
        myTest(t) {
            console.log(t);
        },
        resolveError(error, defaultError = true) {
            if (defaultError) {

                if (error.response.data.errors && error.response.data.errors.Get) {
                    console.log("error:", error.response.data.errors.Get[0])
                } else if (error.response.data.errors && error.response.data.errors.Update) {
                    console.log("error:", error.response.data.errors.Update[0])
                } else if (error.response.data.errors && error.response.data.errors.Delete) {
                    console.log("error:", error.response.data.errors.Delete[0])
                } else {
                    console.log(error.response.data);
                }

                if (error.response.status === 400) {

                    Vue.notify({
                        group: "system",
                        title: "Oops!",
                        text: "400 Bad Request. " + error.response.data,
                        type: "error"
                    });
                    store.dispatch("setFetchStatus", false);

                } else if (error.response.status === 401) {

                    Vue.notify({
                        group: "system",
                        title: "Oops!",
                        text: 'Unauthorized client',
                        type: "error"
                    });
                    console.log('401 Unauthorized. ' + error.response.data);
                    store.dispatch("userLogout");
                    store.dispatch("setFetchStatus", false);

                } else if (error.response.status === 403) {

                    Vue.notify({
                        group: "system",
                        title: "Oops!",
                        text: '403 Forbidden. ' + error.response.data,
                        type: "error"
                    });
                    store.dispatch("setFetchStatus", false);

                } else if (error.response.status === 404) {

                    console.log('404: ' + error.response.data);

                } else if (error.response.status === 409) {// conflict

                    Vue.notify({
                        group: "system",
                        title: "Oops!",
                        text: error.response.data,
                        type: "error"
                    });
                    store.dispatch("setFetchStatus", false);

                } else if (error.response.status === 500) {

                    Vue.notify({
                        group: "system",
                        title: "Oops!",
                        text: "500 Internal Server Error. " + error.response.data,
                        type: "error"
                    });
                    store.dispatch("setFetchStatus", false);

                }
            }
        },
        makeAnonRequest(url, method, data = null, getParam = null, defaultError = true) {
            let requestURL;

            if (typeof (url) === 'object') {
                requestURL = NON_SIMPLE_URL(url)
            } else {
                requestURL = getParam ? urls[url] + getParam : urls[url];
            }

            let headers = {
                "Content-Type": "application/json",
                'Cache-Control': 'no-cache',
                "Pragma": "no-cache",
            };

            return new Promise((resolve) => {
                this.$http({
                    url: requestURL,
                    method,
                    data,
                    headers
                })
                    .catch(error => {
                        this.resolveError(error, defaultError)
                    })
                    .then(response => {
                        resolve(response)
                    });
            })
        },
        makeRequest(url, method, data = null, getParam = null, defaultError = true) {
            let requestURL;

            if (typeof (url) === 'object') {
                requestURL = NON_SIMPLE_URL(url)
            } else {
                requestURL = getParam ? urls[url] + getParam : urls[url];
            }

            let headers = {
                "Content-Type": "application/json",
                'Cache-Control': 'no-cache',
                "Pragma": "no-cache",
            };

            if (this.$cookies.get('userEventAppToken'))
                headers["Authorization"] = "Bearer " + this.$cookies.get('userEventAppToken');

            return new Promise((resolve) => {
                this.$http({
                    url: requestURL,
                    method,
                    data,
                    headers
                })
                    .catch(error => {
                        this.resolveError(error, defaultError)
                    })
                    .then(response => {
                        resolve(response)
                    });
            })
        },
        uploadImg(url, data) {
            this.setLoadingStatus(true);
            this.uploadPercent = 0;

            return new Promise((resolve) => {
                this.$http({
                    url, data,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Cache-Control': 'no-cache',
                        "Pragma": "no-cache",
                        "Authorization": "Bearer " + this.$cookies.get('userEventAppToken')
                    },
                    onUploadProgress: (progressEvent) => {
                        const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
                        this.uploadPercent = Math.round((progressEvent.loaded * 100) / totalLength);
                    }
                })
                    .catch(error => {
                        this.resolveError(error)
                    })
                    .then(response => {
                        this.uploadPercent = 0;
                        if (response && response.status === 200) {
                            this.setLoadingStatus(false);
                            // this.$notify({
                            //     group: "system",
                            //     title: "Great!",
                            //     text: "Image has been uploaded!",
                            //     type: "success"
                            // });
                            resolve(response);
                            console.log('uploadImg', response.data);
                        }
                    });
            })
        },
        deleteImg(url, data) {
            this.setLoadingStatus(true);
            this.uploadPercent = 0;
            const photo = data.photo
            photo.delete = true
            photo.binary = ""
            return new Promise((resolve) => {
                this.$http({
                    url,
                    method: "POST",
                    data: photo,
                    headers: {
                        "Content-Type": "application/json",
                        'Cache-Control': 'no-cache',
                        "Pragma": "no-cache",
                        "Authorization": "Bearer " + this.$cookies.get('userEventAppToken')
                    },
                    onUploadProgress: (progressEvent) => {
                        const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
                        this.uploadPercent = Math.round((progressEvent.loaded * 100) / totalLength);
                    }
                })
                    .catch(error => {
                        this.resolveError(error)
                    })
                    .then(response => {
                        this.uploadPercent = 0;
                        if (response && response.status === 200) {
                            this.setLoadingStatus(false);
                            // this.$notify({
                            //     group: "system",
                            //     title: "Great!",
                            //     text: "Image has been uploaded!",
                            //     type: "success"
                            // });
                            resolve(response);
                            console.log('uploadImg', response.data);
                        }
                    });
            })
        },
        uploadImgWithRezult(url, data) {
            this.setLoadingStatus(true);
            this.uploadPercent = 0;
            return new Promise((resolve, reject) => {
                this.$http({
                    url, data,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Cache-Control': 'no-cache',
                        "Pragma": "no-cache",
                        "Authorization": "Bearer " + this.$cookies.get('userEventAppToken')
                    },
                    onUploadProgress: (progressEvent) => {
                        const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
                        this.uploadPercent = Math.round((progressEvent.loaded * 100) / totalLength);
                    }
                }).catch(error => {
                    reject(error);
                }).then(response => {
                    this.uploadPercent = 0;
                    if (response && response.status === 200) {
                        this.setLoadingStatus(false);
                        // this.$notify({
                        //     group: "system",
                        //     title: "Great!",
                        //     text: "Image has been uploaded!",
                        //     type: "success"
                        // });
                        resolve(response);
                        console.log('uploadImg', response.data);
                    }
                });
            })
        },
        loadCurrentUser() {
            return new Promise((resolve, reject) => {
                this.$http({
                    url: urls.USER_PROFILE,
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Cache-Control': 'no-cache',
                        "Pragma": "no-cache",
                        "Authorization": "Bearer " + Vue.$cookies.get('userEventAppToken')
                    }
                })
                    .catch(error => {
                        /*let user = firebase.auth().currentUser;
                        if (!user) {
                            reject(error);
                            return false;
                        }*/

                        reject(error);
                        this.resolveError(error)
                    })
                    .then(response => {
                        if (response && response.status === 200) {
                            this.setCurrentUser(response.data);
                            resolve(response);
                            console.log('loadCurrentUser', response.data);
                        }
                    });
            })
        },
        loadGroups() {
            return new Promise((resolve) => {
                this.setLoadingStatus(true);
                this.$http({
                    url: urls.GET_GROUPS,
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Cache-Control': 'no-cache',
                        "Pragma": "no-cache",
                        "Authorization": "Bearer " + Vue.$cookies.get('userEventAppToken')
                    }
                })
                    .catch(error => {
                        this.setLoadingStatus(false);
                        this.resolveError(error)
                    })
                    .then(response => {
                        this.setLoadingStatus(false);
                        if (response && response.status === 200) {
                            this.setGroups(response.data.groups);
                            resolve(response);
                            console.log('loadGroups', response.data.groups);
                        }
                        return response
                    });
            })
        },
        loadNotifications(anchor = 20) {
            console.log('anchor', anchor)
            if (anchor - 20 > this.getNotifications.length) return
            console.log('loadNotifications', anchor);
            ///console.log(urls.GET_NOTIFICATIONS + `NewerThanAnchor/${anchor}/${anchor+10}`)
            return new Promise((resolve) => {
                this.$http({
                    url: urls.GET_NOTIFICATIONS + `OlderThanAnchor/0/${anchor}`,
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Cache-Control': 'no-cache',
                        "Pragma": "no-cache",
                        "Authorization": "Bearer " + Vue.$cookies.get('userEventAppToken')
                    }
                })
                    .catch(error => {
                        this.resolveError(error)
                    })
                    .then(response => {
                        if (response && response.status === 200) {
                            this.setNotifications(response.data);
                            resolve(response);
                        }
                    });
            })
        },
        loadGroup(id) {
            return new Promise((resolve) => {
                this.$http({
                    url: urls.GET_GROUP + id,
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Cache-Control': 'no-cache',
                        "Pragma": "no-cache",
                        "Authorization": "Bearer " + Vue.$cookies.get('userEventAppToken')
                    }
                })
                    .catch(error => {
                        this.resolveError(error)
                    })
                    .then(response => {
                        if (response && response.status === 200) {
                            this.setGroup(response.data);
                            resolve(response);
                            console.log('loadGroup', id, response.data);
                        }
                    });
            })
        },
        loadEvent(id) {
            return new Promise((resolve) => {
                this.$http({
                    url: urls.GET_EVENT + id,
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Cache-Control': 'no-cache',
                        "Pragma": "no-cache",
                        "Authorization": "Bearer " + Vue.$cookies.get('userEventAppToken')
                    }
                })
                    .catch(error => {
                        this.resolveError(error)
                    })
                    .then(response => {
                        if (response && response.status === 200) {
                            this.setEvent(response.data);
                            resolve(response);
                            console.log('loadEvent', id, response.data.occurenceIndex, response.data);
                        }
                    });
            })
        },
        loadEventParticipants(id) {
            return new Promise((resolve) => {
                this.$http({
                    url: '/Event/' + id + '/Attendees',
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Cache-Control': 'no-cache',
                        "Pragma": "no-cache",
                        "Authorization": "Bearer " + Vue.$cookies.get('userEventAppToken')
                    }
                })
                    .catch(error => {
                        this.resolveError(error)
                    })
                    .then(response => {
                        if (response && response.status === 200) {
                            this.setEvent(response.data);
                            resolve(response);
                            console.log('loadEventParticipants', id, response.data);
                        }
                    });
            })
        },
        loadPost(id) {
            return new Promise((resolve) => {
                this.$http({
                    url: urls.GET_POST + id,
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Cache-Control': 'no-cache',
                        "Pragma": "no-cache",
                        "Authorization": "Bearer " + Vue.$cookies.get('userEventAppToken')
                    }
                })
                    .catch(error => {
                        this.resolveError(error)
                    })
                    .then(response => {
                        if (response && response.status === 200) {
                            this.setPost(response.data);
                            resolve(response);
                            console.log('loadPost', id, response.data);
                        }
                    });
            })
        },
        loadEventQA(id) {
            return new Promise((resolve) => {
                this.$http({
                    url: '/Event/' + id + '/QuestionsAnswers',
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Cache-Control': 'no-cache',
                        "Pragma": "no-cache",
                        "Authorization": "Bearer " + Vue.$cookies.get('userEventAppToken')
                    }
                })
                    .catch(error => {
                        this.resolveError(error)
                    })
                    .then(response => {
                        if (response && response.status === 200) {
                            this.setEvent(response.data);
                            resolve(response);
                            console.log('loadEventQA', id, response.data);
                        }
                    });
            })
        },
    }
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
