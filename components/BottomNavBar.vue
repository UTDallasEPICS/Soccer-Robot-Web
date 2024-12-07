<template>
    <div class="flex flex-nowrap justify-evenly text-white text-2x1 font-bold py-3" style="background-color: #e87500">
        
        
        <div>
            <p class="cursor-pointer hover:text-gray-300 transition font-semibold duration-300 text-white text-xl" @click="openAboutUs">About Us</p>
        </div>
        <div>
            <p class="cursor-pointer hover:text-gray-300 transition font-semibold duration-300 text-white text-xl" @click="openHowToPlay"> How to Play</p>
        </div>
        <div>
            <p class="cursor-pointer hover:text-gray-300 transition font-semibold duration-300 text-white text-xl" @click="openHelp"> Help </p>
        </div>
        <div>
            <p class="cursor-pointer hover:text-gray-300 transition font-semibold duration-300 text-white text-xl" @click="openLeaderboard"> Leaderboard </p>
            <p class="cursor-pointer hover:text-gray-300 transition font-semibold duration-300 text-white text-xl" v-if="isLoggedIn" @click="openChangeUsername"> Change Username </p>
        </div>
        <div>
            <p class="cursor-pointer hover:text-gray-300 transition font-semibold duration-300 text-white text-xl" @click="openAdminPanel"> Admin Panel </p>
        </div>
    </div>
  
    <AboutUsOverlay v-if="showAboutUs" @closeAboutUsOverlay="closeAboutUs"></AboutUsOverlay>
    <HowToPlayOverlay v-if="showHowToPlay" @closeHowToPlayOverlay="closeHowToPlay"></HowToPlayOverlay>
    <HelpOverlay v-if="showHelp" @closeHelpOverlay="closeHelp"></HelpOverlay>
    <LeaderBoardOverlay v-if="showLeaderboard" @closeLeaderBoardOverlay="closeLeaderboard"></LeaderBoardOverlay>
    <LogInOverlay :isChangingUsername="isChangingUsername" v-if="showChangeUsername" @closeLogIn="closeChangeUsername"></LogInOverlay>
    <AdminPanel v-if="showAdminPanel" @closeAdminPanel="closeAdminPanel"></AdminPanel>
</template>
  
  <script setup lang="ts">

  const sruser = useCookie('sruser');
  const isLoggedIn = computed(() => sruser.value)
  const isChangingUsername = computed(() => true)
  const showAboutUs = ref(false);
  const showHowToPlay = ref(false);
  const showHelp = ref(false);
  const showLeaderboard = ref(false);
  const showChangeUsername = ref(false);
  const openAboutUs = () => { showAboutUs.value = true; };
  const closeAboutUs = () => { showAboutUs.value = false; };
  const openHowToPlay = () => { showHowToPlay.value = true; };
  const closeHowToPlay = () => { showHowToPlay.value = false; };
  const openHelp = () => { showHelp.value = true; };
  const closeHelp = () => { showHelp.value = false; };
  const openLeaderboard = () => { showLeaderboard.value = true; };
  const closeLeaderboard = () => { showLeaderboard.value = false; };
  const openChangeUsername = () => { showChangeUsername.value = true; };
  const closeChangeUsername = () => { showChangeUsername.value = false; };
  </script>
  
<style></style>
