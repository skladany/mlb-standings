<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12" v-if="isLoading">
        <v-progress-circular
          :size="70"
          :width="7"
          indeterminate
        ></v-progress-circular>
      </v-col>
      <v-col cols="12" v-else>
        <h2>As of {{ dateFetched }}</h2>
        <br />
        <v-row justify="center">
          <v-expansion-panels accordion multiple>
            <v-expansion-panel v-for="team in poolStandings" :key="team.id">
              <v-expansion-panel-header
                ><strong>{{ team.wins }}</strong>
                <span class="team-name">{{
                  team.name
                }}</span></v-expansion-panel-header
              >
              <v-expansion-panel-content :value="false">
                <ul v-for="team in team.teams" :key="team.id">
                  <li>
                    <strong>{{ team.wins }}</strong>
                    <span class="team-name">{{ team.name }}</span>
                  </li>
                </ul>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// const ENDPOINT =
//   process.env.NODE_ENV === "development"
//     ? "http://localhost:7777/standings"
//     : "/.netlify/functions/standings/";

const ENDPOINT = "/.netlify/functions/standings/";
import { fetchPoolStandings } from "../api/api.js";

export default {
  name: "Standings",
  data: function() {
    return {
      isLoading: true,
      dateFetched: "",
      poolStandings: [],
      teamStandings: [],
    };
  },
  created: function() {
    this.fetchData();
  },
  methods: {
    fetchData: async function() {
      try {
        const {
          dateFetched,
          poolStandings,
          teamStandings,
        } = await fetchPoolStandings(ENDPOINT);
        console.log({ poolStandings });
        console.log({ teamStandings });

        this.dateFetched = dateFetched;
        this.poolStandings = poolStandings;
        this.teamStandings = teamStandings;

        this.isLoading = false;
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style scoped>
h2 {
  font-size: 1rem;
  font-style: italic;
  color: #ccc;
}

.v-expansion-panel strong {
  flex-grow: 0;
  border: 1px solid white;
  border-radius: 24px;
  min-width: 28px;
  height: 28px;
  padding: 6px;
  margin-right: 12px;
  font-size: 15px;
  line-height: 15px;
  text-align: center;
}

ul {
  list-style-type: none;
}

li {
  display: flex;
  margin-bottom: 8px;
}

.team-name {
  font-size: 1.1rem;
  font-weight: bold;
}

.v-expansion-panel {
  border-top: 1px solid #666;
}

.v-expansion-panel-content {
  text-align: left;
}
</style>
