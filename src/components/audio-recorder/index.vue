<template>
	<div class="audioRecording">
        <!-- <p>Audio recording</p>
        <svg class="audioRecording__microphone" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.68 12.3953C19.68 11.9153 19.3129 11.5482 18.8329 11.5482C18.3529 11.5482 17.9859 11.9153 17.9859 12.3953C17.9859 15.6988 15.3035 18.3812 12 18.3812C8.69646 18.3812 6.01411 15.6988 6.01411 12.3953C6.01411 11.9153 5.64705 11.5482 5.16705 11.5482C4.68705 11.5482 4.31999 11.9153 4.31999 12.3953C4.31999 16.32 7.25646 19.6235 11.1529 20.0471V22.3059H8.07529C7.59529 22.3059 7.22823 22.673 7.22823 23.153C7.22823 23.633 7.59529 24 8.07529 24H15.9247C16.4047 24 16.7718 23.633 16.7718 23.153C16.7718 22.673 16.4047 22.3059 15.9247 22.3059H12.8471V20.0471C16.7435 19.6235 19.68 16.32 19.68 12.3953Z" fill="#2889FC"/>
        <path  d="M8.13468 4.71529C8.13468 2.58709 9.87177 0.85 12 0.85C14.1282 0.85 15.8652 2.58709 15.8652 4.71529V12.3953C15.8652 14.522 14.1306 16.2581 12.0045 16.2606C9.86614 16.2348 8.13468 14.5169 8.13468 12.3671V4.71529Z" fill="white" stroke="#2889FC" stroke-width="1.7"/>
        </svg> -->
        <!-- <VueRecordAudio :mode="'press'" @stream="onStream" @result="onResult" />
          <div v-for="(record, index) in recordings" :key="index" class="recorded-item">
                <div class="audio-container"><audio :src="record.src" controls /></div>
                <div><button @click="removeRecord(index)" class="button is-dark">delete</button></div>
        </div> -->
    </div>
</template>

<script>

	export default {
        data(){
            return{
                recordings:[]
            }
        },
        methods: {
             onResult (data) {
                // console.log('The blob data:', data);
                // console.log('Downloadable audio', window.URL.createObjectURL(data));
                   this.recordings.push({src: window.URL.createObjectURL(data)})
            },
            onStream(data){
                console.log(data)
            }
        }
	};
</script>
<style lang="scss">
    @import "./../../style/components/modals/_audio-recorder.scss";
</style>
