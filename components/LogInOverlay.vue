<template>
<div class="fixed w-full h-full inset-0 backdrop-blur bg-black bg-opacity-25 flex" style="z-index: 2;">
    <div class="rounded-lg p-2 bg-white border-black border-2" style="margin: auto; width: 35%; height: 75%;"> 
        <p class="text-black font-black text-lg text-center" style="font-family: Inter; color: #154734; margin-top: 10%; margin-bottom: 3%;">Set Username</p>
        <form @submit.prevent="handleSubmit">
            <label class="font-semibold text-lg block" style="font-family: Inter; color: #777070;margin-left:14.5%; letter-spacing: 1.5px;">USERNAME</label>
            <p class="text-red-600">{{ mssg }}</p>
            <input class="text-black border-2 border-black p-5 block font-semibold text-sm" placeholder="Enter username here" style="border-radius: 20px; border-color: #B6B6B6; width: 80%; margin-left: 10.5%; letter-spacing: 1.5px; font-family: Inter;;" type="text" v-model="username" required>  
            <button class="text-white border p-4 font-semibold text-lg tracking-widest" style="background-color: #E87500; border-radius: 20px; width: 65%; margin-left: 17%; margin-top: 5%; font-family: Inter;">Set Username</button> 
        </form>
    </div>
</div>

</template>

<script setup lang="ts">
const username = ref("")
const mssg = ref("")
const handleSubmit = async () => {
    if(username.value.length >= 3 && username.value.length <= 15){
        const req:string = await $fetch('api/user', {
            method: 'post',
            body: {
                username: username.value
            }
        })
        if(parseInt(req) == 200){
            emitClose()
        } else{
            mssg.value = "Username already exists"
        }
    } else {
        mssg.value = "Usernae has to be between 3 and 15 characters"
    }
}
const emit = defineEmits(['closeLogIn'])
const emitClose = () => {
    emit('closeLogIn')
}

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
</style>