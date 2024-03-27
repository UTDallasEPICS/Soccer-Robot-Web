<template>
    <div class="">
        <Profile v-if="userTrue"></Profile>
        <LogInSignUp v-else></LogInSignUp>
    </div>
</template>

<script setup lang="ts">
    const userTrue = ref(true)
</script>


<style>

</style>