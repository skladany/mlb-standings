<template>
  <div class="container">
    <LineChart v-if="loaded" :chartdata="chartdata" :options="options" />
  </div>
</template>

<script>
import LineChart from "./LineChart.vue";
import players from "../data/players.js";
import { fetchPoolStandings } from "../api/api.js";

const ENDPOINT = "/.netlify/functions";
// const START_DATE = "2021-04-01";
// const END_DATE = "2021-04-07";

export default {
  name: "TimeLine",
  components: { LineChart },
  data: () => ({
    loaded: false,
    chartdata: null,
  }),
  async mounted() {
    this.loaded = false;
    try {
      // let full_date = new Date(START_DATE);
      // let end_date = new Date(END_DATE);

      // let date = full_date.toISOString().split("T")[0];

      // let labels = [];
      // let standingsMap = {};
      players.forEach(async (player) => {
        const standings = await fetchPoolStandings(
          `${ENDPOINT}/timeline?player=${player.id}`
        );

        console.log({ player });
        console.log({ standings });
        // console.log("player:", player.id, standings);

        // standingsMap[player.id] = [];
      });
      // console.log({standingsMap});

      // while (full_date < end_date) {

      //   date = full_date.toISOString().split("T")[0];
      //   // console.log({ date });
      //   // console.log({standingsMap});

      //   const {
      //     poolStandings
      //   } = await fetchPoolStandings(`${ENDPOINT}?date=${date}`);

      //   labels.push(date)

      //   // Loop through poolStandings, adding to standingsMap
      //   poolStandings.forEach( player => {
      //     // console.log({player})
      //     // console.log(standingsMap[player.id])
      //     standingsMap[player.id].push(player.wins);
      //   })

      //   // increment date
      //   full_date.setDate(full_date.getDate() + 1);
      // }

      // let datasets = [];

      // for (const player in standingsMap) {
      //   datasets.push({
      //     label: player,
      //     fill: false,
      //     data: standingsMap[player],
      //     // borderColor: players[player].color,
      //     tension: 0,
      //   });
      // }

      // console.log(datasets);

      // const data = {
      //   labels,
      //   datasets,
      // };

      // this.chartdata = data;
      // this.loaded = true;
    } catch (e) {
      console.error(e);
    }
  },
};
</script>
