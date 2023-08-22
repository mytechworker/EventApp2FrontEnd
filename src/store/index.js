import Vue from 'vue'
import Vuex from 'vuex'
import urls from "../common/urls";
import firebase from "firebase/app";
import "firebase/auth";
import router from "../router";
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        currentUser: {},
        isLoading: false,
        events: [],
        event: [],
        groups: [],
        group: {},
        notifications: [],
        posts: [],
        post: [],
        currentFile: {},
        activeModal: null,
        activeSidebar: null,
        generateJoinLinkModal: false,
        activePage: "Events",
        newNotifications: 0,
        minimizedInfo: false
    },
    getters: {
        getLoadingStatus: state => {
            return state.isLoading;
        },
        getGenerateJoinLinkModalStatus: state => {
            return state.generateJoinLinkModal;
        },
        getCurrentUser: state => {
            return state.currentUser;
        },
        getGroups: state => {
            return state.groups;
        },
        getGroup: state => {
            return state.group;
        },
        getEvent: state => {
            return state.event;
        },
        getActiveModal: state => {
            return state.activeModal
        },
        getActiveSidebar: state => {
            return state.activeSidebar
        },
        getCurrentFile: state => {
            return state.currentFile;
        },
        getPost: state => {
            return state.post;
        },
        getNotifications: state => {
            return state.notifications;
        },
        getNewNotifications: state => {
            return state.currentUser.countOfNewNotificationMessages;
        },
        getActivePage: state => {
            return state.activePage;
        },
        getMinimizedInfo: state => {
            return state.minimizedInfo;
        },

    },
    mutations: {
        setLoadingStatus(state, bool = Boolean) {
            state.isLoading = bool;
        },
        setGenerateJoinLinkModalStatus(state, bool = Boolean) {
            state.generateJoinLinkModal = bool;
        },
        setCurrentUser(state, obj = Object) {
            state.currentUser = { ...obj };
        },
        setGroups(state, arr = Array) {
            state.groups = [...arr];
        },
        setGroup(state, obj = Object) {
            state.group = { ...obj };
        },
        setEvent(state, obj = Object) {
            state.event = { ...obj };
        },
        setModal(state, str = String) {
            state.activeModal = str;
        },
        setSidebar(state, str = String) {
            state.activeSidebar = str;
        },
        setCurrentFile(state, obj = Object) {
            state.currentFile = { ...obj };
        },
        setPost(state, obj = Object) {
            state.post = { ...obj };
        },
        setNotifications(state, arr = Array) {
            state.notifications = [...arr];
        },
        setNewNotifications(state, num = Number) {
            state.newNotifications = num;
        },
        setActivePage(state, str = String) {
            window.localStorage.setItem('activeSection', str);
            state.activePage = str;
        },
        setMinimizedInfo(state, st = Boolean) {
            state.minimizedInfo = st;
        }

    },
    actions: {
        async searchGroup({ commit }, options) {
            commit("setLoadingStatus", true);

            let url = urls.SEARCH_GROUPS;
            let data = null;
            data = {
                text: options && options.text ? options.text : '',
                page: options && options.page ? options.page : 1, //0
                pageSize: options && options.pageSize ? options.pageSize : 9
            };

            return new Promise((resolve, reject) => {
                this._vm
                    .$http({
                        url,
                        data,
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Cache-Control": "no-cache",
                            Pragma: "no-cache",
                            Authorization: "Bearer " + Vue.$cookies.get("userEventAppToken")
                        }
                    })
                    .catch(error => {
                        commit("setLoadingStatus", false);
                        reject(error);
                    })
                    .then(response => {
                        commit("setLoadingStatus", false);
                        commit("setGroups", [response.data]);
                        setTimeout(() => resolve(response), 200);
                    });
            });
        },

        async loadCurrentUser({ commit }) {
            return new Promise((resolve, reject) => {
                this._vm.$http({
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
                        reject(error)

                        if (error.response && error.response.status !== 200) {
                            this.dispatch('userLogout');
                            this.dispatch('setFetchStatus', false);
                        }
                    })
                    .then(response => {
                        resolve(response);
                        if (response && response.status === 200) {
                            commit("setCurrentUser", response.data);
                        }
                    });
            })
        },
        setCurrentEvent({ commit }, event) {
            commit("setEvent", event);
        },
        setCurrentFile({ commit }, file) {
            commit("setCurrentFile", file);
        },
        userLogout({ commit }) {
            const user = firebase.auth().currentUser;
            if (user) {
                firebase.auth().signOut()
                    .then(() => {
                        Vue.$cookies.remove("userEventAppToken");
                        router.push({ name: "SignIn" });
                        commit("setGroup", {});
                        commit("setGroups", []);
                        commit("setEvent", {});
                        commit("setCurrentFile", {});
                        commit("setCurrentUser", {});
                        Vue.notify({
                            group: "system",
                            title: "Goodbye!",
                            text: 'See you later!',
                            type: "info"
                        });
                    })
                    .catch((error) => {
                        Vue.notify({
                            group: "system",
                            title: "Oops!",
                            text: 'error: ' + error,
                            type: "error"
                        });
                    });
            } else {

                firebase.auth().signOut()
                    .then(() => {
                        Vue.$cookies.remove("userEventAppToken");
                        router.push({ name: "SignIn" });
                        commit("setGroup", {});
                        commit("setGroups", []);
                        commit("setEvent", {});
                        commit("setCurrentFile", {});
                        commit("setCurrentUser", {});
                        Vue.notify({
                            group: "system",
                            title: "Goodbye!",
                            text: 'See you later!',
                            type: "info"
                        });
                    })
                    .catch((error) => {
                        Vue.notify({
                            group: "system",
                            title: "Oops!",
                            text: 'error: ' + error,
                            type: "error"
                        });
                    });

            }
        },
        setActiveModal({ commit }, type) {
            commit("setModal", type);
        },
        setActiveSidebar({ commit }, type) {
            commit("setSidebar", type);
        },
        clearGroup({ commit }) {
            commit("setGroup", {});
        },
        setCurrentPost({ commit }, post) {
            commit("setPost", post);
        },
        setFetchStatus({ commit }, status) {
            commit("setLoadingStatus", status);
        },
        setGenerateJoinLinkModalStatus({ commit }, status) {
            commit("setLoadingStatus", status);
        },
    },
    modules: {}
})
