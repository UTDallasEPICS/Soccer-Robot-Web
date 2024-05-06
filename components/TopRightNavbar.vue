<template>
    <div class="">
        {{ sruser }}
        <Profile v-if="sruser"></Profile>
        <LogOut v-if="sruser"></LogOut>
        <LogInSignUp v-else></LogInSignUp>
    </div>
</template>

<script setup lang="ts">
    const sruser = useCookie("sruser")
</script>


<style>

</style>