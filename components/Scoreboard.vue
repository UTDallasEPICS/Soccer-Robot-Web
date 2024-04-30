<template>
  <div class="border-4 rounded-lg border-black flex justify-between items-center overflow-hidden" style="width: 959px; height: 69px; margin-top: 0%;">
    <p class="border-r-4 rounded-r-none border-black rounded-lg bg-auto" style="font-family: Jockey One; font-weight: 400; font-size: 60px; background-color: #E87500 ;width: 130px; text-align: center;">{{ user1score }}</p>
    <p class="basis-0 grow text-center" style="font-family: Helvetica; font-weight: bold; font-size: 30px">{{user1}}</p>
    <div class="bg-slate-300 w-min border-black border-l-4 border-r-4 h-full px-3 h-full flex items-center">
      <p class="" style="font-family: Helvetica; font-weight: bold; font-size: 30px">{{ formatTimer }}</p>
    </div>
    <p class="basis-0 grow text-center" style="font-family: Helvetica; font-weight: bold; font-size: 30px">{{user2}}</p>
    <p class="border-l-4 rounded-l-none border-black rounded-lg bg-auto" style="font-family: Jockey One; font-weight: 400; font-size: 60px; background-color: #5FE0B7; width: 130px; text-align: center;">{{ user2score }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
    user1: {type: String, default: ""},
    user2: {type: String, default: ""},
    timer: {type: Number, default: 0},
    user1score: {type: Number, default: 0},
    user2score: {type: Number, default: 0}
})

const formatTimer = computed(() => {
  const minutes: number = Math.floor(props.timer / 60);
  const seconds = props.timer - minutes * 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Jockey+One&display=swap')
</style>
