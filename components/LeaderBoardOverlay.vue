
<script setup>
const emit = defineEmits(['closeLeaderBoardOverlay'])
const emitClose = () => {
    emit('closeLeaderBoardOverlay')
}
</script>

<template>
  <div class="fixed w-full h-full inset-0 bg-black bg-opacity-80 flex" style="z-index: 2">
          <div class="rounded-lg p-2 bg-white" style="width: 500px; height: 400px; margin: auto;">
              <div class="w-min h-min text-black" style="margin-left: auto;">
                  <p @click="emitClose" class="cursor-pointer">X</p>
              </div>
              <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(player, index) in sortedPlayers" :key="player.id">
          <td>{{ index + 1 }}</td>
          <td>{{ player.name }}</td>
          <td>{{ player.score }}</td>
        </tr>
      </tbody>
    </table>
            </div>
  </div>
  </template>
  
  <script>
  import axios from 'axios';


export default {
  data() {
    return {
      players: [], // Initially empty, will be populated from API
    };
  },
  computed: {
    sortedPlayers() {
      return this.players.sort((a, b) => b.score - a.score);
    },
  },
  created() {
    this.fetchPlayers();
  },
  methods: {
    async fetchPlayers() {
      try {
        const response = await axios.get('https://api.example.com/players'); // Replace with your API URL
        this.players = response.data; // Assuming API returns a JSON array of players
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    },
  },
};
</script>

<style scoped>
.leaderboard {
  max-width: 600px;
  margin: 20px auto;
  text-align: center;
  font-family: Arial, sans-serif;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 10px;
  border: 1px solid #ccc;
}

th {
  background-color: #f4f4f4;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}
</style>