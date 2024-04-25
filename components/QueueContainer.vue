<template>
    <div class="w-340 h-full mt-[-12px]">
      <UpComing/>
      <Queue @join-queue="$emit('join-queue')" @leave-queue="$emit('leave-queue')"/>
    </div>
  </template>
  
  <script setup lang="ts">
  </script>
  