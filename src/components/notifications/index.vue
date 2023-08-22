<template>
  <div class="notifications">
    <div class="notifications__header">
      <div class="h2">Notifications</div>
      <div class="close" @click="close()">
        <img src="@/assets/svg/icon-close.svg" />
      </div>
    </div>
    <div @scroll="scroll" ref="scroll" id="scroll" class="notifications__list">
      <notification
        :item="item"
        v-for="item in getNotifications"
        @readNotif="updateNotif"
        :key="item.id"
      />
    </div>
  </div>
</template>

<script>
export default {
  components: {
    notification: () => import("./notification"),
  },
  data() {
    return {
      anchor: 20,
      loading: false,
    };
  },
  methods: {
    close() {
      this.$store.dispatch("setActiveSidebar", null);
    },
    updateNotif(id) {
      const update = [...this.getNotifications];
      const index = update.findIndex((item) => item.id === id);
      update[index].isSeen = true;
      this.setNotifications(update);
      
    },
    async scroll() {
      if (!this.loading) {
        
        console.log(this.$refs.scroll.scrollHeight);
        if (
          this.$refs.scroll.scrollHeight -
            this.$refs.scroll.clientHeight -
            this.$refs.scroll.scrollTop <
          10
        ) {
          this.loading = true;
          this.anchor += 20;
          const result= await this.loadNotifications(this.anchor);
          if(result!==undefined) this.$refs.scroll.scrollTop-=100;
          this.loading = false;
        }
        
      }
    },
    scrollMove(val){
      if(val=="up"){
        this.$refs.scroll.scrollTop-=this.$refs.scroll.clientHeight
      }else if(val=="down"){
         this.$refs.scroll.scrollTop+=this.$refs.scroll.clientHeight
      }else{
      this.$refs.scroll.scrollTop+=val;
      }
    }
  },
   async created(){
      if(this.getNotifications.length===0){
       await this.loadNotifications(this.anchor);
      }
    },
    mounted(){
      this.handler = (e)=> {
      switch (e.keyCode) {
        case 33: //pageup
          this.scrollMove("up")
        break;
        case 34: //pagedown
          this.scrollMove("down")
        break;
        case 38: //up
          this.scrollMove(-200)
        break;
        case 40: //down
          this.scrollMove(200)
        break;
      }

    }
    this.keydown  = function (e) {
      if(e.keyCode===33 || e.keyCode===34 || e.keyCode===38 || e.keyCode===40){
      e.preventDefault()
      }
    }
    window.addEventListener('keyup', this.handler);
    window.addEventListener('keydown', this.keydown);
    }
};
</script>

<style lang="scss">
@import "./../../style/components/_notifications.scss";
</style>