<template>
    <div class="flex md:flex md:flex-grow flex-row-reverse space-x-3 space-x-reverse mt-5 mr-5 mb-2">
        <div>
            <div class="">
            <button
                class="hover:text-gray-300 transition font-semibold duration-400 text-white font-bold py-2 px-5 rounded-lg"
                style="background-color:#FF0000" @click="logout"> {{ "Log Out" }}</button>
            </div>
        </div>
        <div class="profileTemp">
            <img src="../public/Profile.svg">
        </div>
        <div class="mt-1">
            <p>{{ username }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">

    import type { Player } from '@prisma/client'
    import { userStore } from "~/stores/user";

    const store = userStore()
    const getUser = useCookie<Partial<Player>>('sruser')
    const username = ref('')
    //username.value = store.name
    //console.log(username.value, "here")
    //console.log(store.name)

    /*
    const { data: playerData } = await useFetch<Player>(`/api/user/${(getUser.value?.user_id)}`, {
      method: 'GET',
    })
    username.value = playerData?.value?.username as unknown as string
    */
    username.value = store.name

    const logout = async () => { 
        window.location.href='api/logout'
    }
</script>

<style>
</style>