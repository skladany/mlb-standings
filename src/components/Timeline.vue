<template>
  <div class="container">
    <!-- <div style="width:100vw;height:80vh"> -->
    <LineChart v-if="loaded" :chartdata="chartdata" :options="options" />
    <!-- </div> -->
  </div>
</template>

<script>
import LineChart from "./LineChart.vue";
const { players } = require("../data/players.json");

const ENDPOINT = "/.netlify/functions";

// const date = new Date();
// const season_end = new Date("2021-10-04");
let startDate, endDate;

//if (date > season_end) {
startDate = "2021-04-01";
endDate = "2021-10-03";
// } else {
//   endDate = date.toISOString().split("T")[0];

//   // Last week
//   date.setDate(date.getDate() - 7);
//   startDate = date.toISOString().split("T")[0];
// }

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
      let labels = getDates({ startDate: startDate, endDate: endDate });

      let datasets = [];
      players.forEach(async (player) => {
        const standings = await fetchTimeline(
          `${ENDPOINT}/timeline?player=${player.id}&startDate=${startDate}&endDate=${endDate}`
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
