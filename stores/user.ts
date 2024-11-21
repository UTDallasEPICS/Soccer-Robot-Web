import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref } from 'vue'

export const userStore = defineStore('username', () => {

    const name = ref('')

    function set(username: string) {
        name.value = username
    }
    function get() {
        return name.value
    }

    return { name, set, get }
})