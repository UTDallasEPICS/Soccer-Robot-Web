    <template>
        <button v-bind:style="{backgroundColor : buttonColor}" v-on:click="changeButton()" class = "border-4 rounded-2xl border-black content-center rounded-t-none" style="padding: 5px; margin-left:76%; margin-top: 36%; width:330px; font-size: 24px; font-weight: bold">
            {{ buttonStatus }}
        </button> <!--Button is unclickable due to collision with the container, margin-left:75.85 and margin-top: 37% is perfect fit-->
    </template>

    <script setup lang = "ts">
    const buttonStatus = ref("Join Queue");    
    const buttonColor = ref("#5FE0B7");

    const changeButton = () => {
        if(buttonColor.value == '#5FE0B7')
        {
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