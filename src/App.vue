<template>
    <div id="app">
        <transition name="fade" mode="out-in">
            <router-view/>
        </transition>

        <c-loader-line v-show="loadingStatus"/>
        <vue-confirm-dialog class="confirm-dialog" :class="{'new-design': generateJoinLinkModalStatus}"></vue-confirm-dialog>
        <notifications group="system" style="margin-top: 30px"/>
        <c-back-to-top/>
    </div>
</template>

<!--:class="{'dialog-new-design': minimizedInfo}"-->

<script>
    export default {
        components: {
            "c-loader-line": () => import("./components/loading"),
            "c-back-to-top": () => import("./components/button/backToTop"),
        },
        computed: {
            loadingStatus() {
                return this.getLoadingStatus
            },
            generateJoinLinkModalStatus() {
              return this.getGenerateJoinLinkModalStatus
            }
        },
        mounted() {
          if (this.$cookies.get('userEventAppToken')) this.loadCurrentUser();
          const text="Sorry, something went wrong. Please try again later, if the error persists please contact support."
          if(!window.LINK_CONFIG){
           this.$notify({
                group: "system",
                title: "LINK_CONFIG not found",
                text,
                type: "error",
            });
          }
           if(!window.H_CONFIG){
           this.$notify({
                group: "system",
                title: "H_CONFIG not found",
                text,
                type: "error",
            });
          }
           if(!window.FB_CONFIG){
           this.$notify({
                group: "system",
                title: "FB_CONFIG not found",
                text,
                type: "error",
            });
          }
        },


    }
</script>

<style lang="scss">
    @import url('https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;500;700;900&display=swap');
    * {
      box-sizing: border-box;
    }
    body {
        padding: 0;
        margin: 0;
        background: #FAFBFD;
        font-family: 'Red Hat Display', sans-serif;

        @media (max-width: 767px) {
         &.modal-opened {
           overflow: hidden;
         }
        }
    }
    #app {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: left;
    }

    .slide-fade-enter-active {
        transition: all .1s ease;
    }

    .slide-fade-leave-active {
        transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    .slide-fade-enter, .slide-fade-leave-to {
        transform: translateX(10px);
        opacity: 0;
    }

    .transf {
        text-transform: uppercase;
    }
    select {
        -moz-appearance: none;
        -webkit-appearance: none;
        width: 100%;
        display: block;
        box-sizing: border-box;
        border: none;
        outline: none;
    }

    input {
        -moz-appearance: none;
        -webkit-appearance: none;
        width: 100%;
        display: block;
        box-sizing: border-box;
        border: none;
        outline: none;
    }

    div {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .mx-datepicker{
        .mx-input{
            height: 52px!important;
            background-color: #fff;
            border: 1px solid #C7CDD8;
            color: #222;
            box-shadow: none;
            font-size: 16px;
            &:focus {
                outline: none;
            }

            &::placeholder {
                color: #B2BBCE;
            }
        }
        .mx-icon-calendar{
            color: #909DB1;
            font-size: 20px;
        }
    }

    .v-select {
        height: 52px !important;
        width: 100% !important;
        border-radius: 4px !important;

        .vs__actions{
            padding: 0 15px 0 3px;
        }

        .vs__dropdown-toggle {
            height: 100%;
            border-radius: 4px !important;
            padding: 0 !important;
            border-color: #C7CDD8;
        }

        .vs__selected-options {
            height: 100%;
            padding-left: 7px;
            input{
                margin: 0;
                &::placeholder {
                    color: #B2BBCE;
                }
            }

            .vs__selected {
                font-size: 14px;
                height: 100%;
                margin: 0;
                padding: 10px;
                font-weight: 600;
            }
        }
    }
    svg {
      outline: none;
    }


</style>
