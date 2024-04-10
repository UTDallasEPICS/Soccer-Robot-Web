<template>
    <div class="flex flex-col">
        <div>
            <TopNavBar></TopNavBar>
            <BottomNavBar></BottomNavBar>
        </div>
        <div class="flex justify-center py-6">
            <div class="flex flex-col">
                <Scoreboard></Scoreboard>
                <span class="py-4 pr-6">
                    <VideoStream></VideoStream>
                </span>
            </div>
            <QueueContainer></QueueContainer>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
/* Add any scoped styles here */
</style>