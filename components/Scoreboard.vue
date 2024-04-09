<template>
    
  <div class="border-4 rounded-2xl border-black flex justify-between items-center overflow-hidden" style="width: 888px; height: 84px; margin-top: 0%;">
      <p class="border-r-4 rounded-r-none border-black rounded-2xl bg-auto" style="font-family: Jockey One; font-weight: 400; font-size: 60px; background-color: #E87500 ;width: 130px; text-align: center;">{{ user1score }}</p>
      <p class="basis-0 grow text-center" style="font-family: Helvetica; font-weight: bold; font-size: 30px">{{user1}}</p>
      <div class="bg-slate-300 w-min border-black border-l-4 border-r-4 h-full px-3 h-full flex items-center" >
        <p class="" style="font-family: Helvetica; font-weight: bold; font-size: 30px">{{ timer }}</p>
      </div>
      <p class="basis-0 grow text-center" style="font-family: Helvetica; font-weight: bold; font-size: 30px">{{user2}}</p>
      <p class="border-l-4 rounded-l-none border-black rounded-2xl bg-auto" style="font-family: Jockey One; font-weight: 400; font-size: 60px; background-color: #5FE0B7; width: 130px; text-align: center;">{{ user2score }}</p>
  </div>
</template>

<script setup lang="ts">
const user1 = ref("SemiUltra")
const user2 = ref("xyzeb")
const timer = ref("0:00")
const user1score = ref(20)
const user2score = ref(10)
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Jockey+One&display=swap')
</style>