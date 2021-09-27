<template>
  <div class="container">
    <LineChart v-if="loaded" :chartdata="chartdata" :options="options" />
  </div>
</template>

<script>
import LineChart from "./LineChart.vue";
const { players } = require("../data/players.json");
console.log(players);

const ENDPOINT = "/.netlify/functions";
const START_DATE = "2021-09-05";
const END_DATE = "2021-09-08";
import { fetchTimeline } from "../api/api";
import { getDates } from "../utils/utils";

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
      let labels = getDates({ startDate: START_DATE, endDate: END_DATE });

      let datasets = [];
      players.forEach(async (player) => {
        console.log({ player });
        const standings = await fetchTimeline({
          endpoint: `${ENDPOINT}/timeline?player=${player.id}&startDate=${START_DATE}&endDate=${END_DATE}`,
        });

        // Cycle thru each date, fetch missing data
        datasets.push({
          label: player.name,
          fill: false,
          data: standings,
          borderColor: player.color,
          tension: 0,
        });
      });

      let data = {
        labels,
        datasets,
      };

      this.chartdata = data;

      // HAAACK
      setTimeout(() => {
        this.loaded = true;
      }, 1000);
    } catch (e) {
      console.error(e);
    }
  },
};
</script>
