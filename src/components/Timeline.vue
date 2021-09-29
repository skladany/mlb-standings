<template>
  <div class="container">
    <LineChart v-if="loaded" :chartdata="chartdata" :options="options" />
  </div>
</template>

<script>
import LineChart from "./LineChart.vue";
const { players } = require("../data/players.json");

const ENDPOINT = "/.netlify/functions";
// const START_DATE = "2021-04-01";
const START_DATE = "2021-08-01";
const END_DATE = "2021-09-08";
import { fetchTimeline } from "../api/api";
import { getDates } from "../utils/utils";

export default {
  name: "TimeLine",
  components: { LineChart },
  data: () => ({
    loaded: false,
    chartdata: null,
    options: null,
  }),
  async mounted() {
    this.loaded = false;
    try {
      let labels = getDates({ startDate: START_DATE, endDate: END_DATE });

      let datasets = [];
      players.forEach(async (player) => {
        const standings = await fetchTimeline(
          `${ENDPOINT}/timeline?player=${player.id}&startDate=${START_DATE}&endDate=${END_DATE}`
        );

        console.log({ standings });

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
      console.log({ data });

      // HAAACK
      setTimeout(() => {
        this.loaded = true;
      }, 500);
    } catch (e) {
      console.error(e);
    }
  },
};
</script>
