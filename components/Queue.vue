<template>
    <div class="border-black rounded-lg border-4 border-b-0 rounded-b-none" style="width: 340px; height: 500px;">
        <p class="text-center border-b-2 border-black border-b-4" style="font-weight: bold; font-size: 24px">Queue</p>
        <div class="overflow-y-auto h-full">
            <div v-for="(user, index) in queueUsers" :key="index">
            <QueueCard  v-if="index % 2 == 0" :user1="getTwoUsers(index)[0]" :user2="getTwoUsers(index)[1]" :style="{backgroundColor : changeCardColor(index)}"/>
            </div>
        </div>
    </div>
    <button v-bind:style="{backgroundColor : buttonColor}" @click="changeButton();" class = "border-4 rounded-2xl border-black content-center rounded-t-none" style="font-size: 24px; font-weight: bold; width: 100%;">
        {{ buttonStatus }}
    </button> <!--Button is unclickable due to collision with the container, margin-left:75.85 and margin-top: 37% is perfect fit-->
</template>

<script setup lang = "ts">
const buttonStatus = ref("Join Queue");    
const buttonColor = ref("#5FE0B7");
let cardColor = "#D9D9D9";

const changeCardColor = (index:number) => {
    index = index/2
    console.log(index);
    let cardCounter = index;
    if(cardCounter % 2 === 0)
    {
        cardColor = "#D9D9D9";
    }
    else
    {
        cardColor = "#E87500";
    }
    return cardColor;
}

const queueUsers = ref<Array<string>>([])
const counter = ref(0)
const getTwoUsers = (index: number) => {
    let name1: string = (index < queueUsers.value.length) ? queueUsers.value[index] : ""
    let name2: string = (index+1 < queueUsers.value.length) ? queueUsers.value[index+1] : ""
    return [name1, name2]
}


const addUser = () => {
    queueUsers.value.push(String(counter.value))
    counter.value++
}

const changeButton = () => {
    if(buttonColor.value == '#5FE0B7')
    {
        addUser();
        buttonColor.value = '#FF0000';
        buttonStatus.value = 'Leave Queue';
    }
    else
    {
        buttonColor.value = '#5FE0B7'
        buttonStatus.value = 'Join Queue';
    }
};
</script>