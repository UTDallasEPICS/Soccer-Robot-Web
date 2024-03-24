<template>
  <iframe :src="src" frameborder="0" allowfullscreen="false" scrolling="no" :height="height" :width="width"></iframe>
</template>

<script setup lang="ts">
  const runtime = useRuntimeConfig()
  const src = `https://player.twitch.tv/?channel=${runtime.CHANNEL_NAME}&parent=${runtime.PARENT_NAME}` 
  const height = 500
  const width = 888
</script>

<style>

</style>