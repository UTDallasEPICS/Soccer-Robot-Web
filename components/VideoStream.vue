<template>
  <iframe :src="src" frameborder="0" allowfullscreen="false" scrolling="no" :height="height" :width="width"></iframe>
</template>

<script setup lang="ts">
  const src = `https://player.twitch.tv/?channel=${process.env.CHANNELNAME}&parent=${process.env.PARENTNAME}` 
  const height = 500
  const width = 888
</script>

<style>

</style>