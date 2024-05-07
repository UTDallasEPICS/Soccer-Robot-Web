<template>
    <div class="">
        <Profile v-if="userTrue"></Profile>
        <LogInSignUp v-else></LogInSignUp>
    </div>
</template>

<script setup lang="ts">
    const userTrue = ref(false)
    const srtoken = useCookie('srtoken')
    if(srtoken.value == ''){
        userTrue.value = false
    } else {
        userTrue.value = true
    }
</script>


<style>

</style>