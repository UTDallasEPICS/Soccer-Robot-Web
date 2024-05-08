<template>
    <div class="flex md:flex md:flex-grow flex-row-reverse space-x-3 space-x-reverse mt-5 mr-5 mb-2">
        <div class="profileTemp">
            <img src="../public/Profile.svg">
        </div>
        <div class="mt-1">
            <p>{{ username }}</p>
        </div>
    </div>

</template>

<script setup lang="ts">
    const getUser = useCookie('sruser')
    let username = getUser.value
</script>

<style setup lang="ts">
</style>