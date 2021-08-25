<template>
  <div class="container">
    <LineChart v-if="loaded" :chartdata="chartdata" :options="options" />
  </div>
</template>

<script>
import LineChart from "./LineChart.vue";
import players from "../data/players.js";
import { fetchPoolStandings } from "../api/api.js";

const ENDPOINT = "/.netlify/functions/standings";
const START_DATE = "2021-04-01";
const END_DATE = "2021-04-03";

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
      let full_date = new Date(START_DATE);
      let end_date = new Date(END_DATE);

      let date = full_date.toISOString().split("T")[0];

      let labels = [];
      let standingsMap = players.map( p => { return { [p.id]:[] } } )
      console.log({standingsMap});

      while (full_date < end_date) {
        
        date = full_date.toISOString().split("T")[0];
        console.log({ date });

        const {
          poolStandings,
          teamStandings,
        } = await fetchPoolStandings(`${ENDPOINT}?date=${date}`);

        labels.push(date)

        console.log({poolStandings});
        console.log({teamStandings});

        // increment date
        full_date.setDate(full_date.getDate() + 1);
      }


      const data = {
        labels,
        datasets: [
          {
            label: players[0].name,
            fill: false,
            data: [1, 1, 2, 2, 2, 2, 3],
            borderColor: players[0].color,
            tension: 0,
          },
          {
            label: players[1].name,
            fill: false,
            data: [0, 1, 1, 1, 2, 2, 2],
            borderColor: players[1].color,
            tension: 0,
          },
        ],
      };

      this.chartdata = data;
      this.loaded = true;
    } catch (e) {
      console.error(e);
    }
  },
};
</script>
