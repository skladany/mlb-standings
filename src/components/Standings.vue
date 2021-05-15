<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row class="text-center">
          <v-col cols="12">
            <h1>Baseball Standings</h1>
            <h2>As of {{ dateFetched }}</h2>
            <br />
            <v-row justify="center">
              <v-expansion-panels accordion>
                <v-expansion-panel v-for="team in poolStandings" :key="team.id">
                  <v-expansion-panel-header
                    ><strong>{{ team.wins }}</strong>
                    <span class="team-name">{{
                      team.name
                    }}</span></v-expansion-panel-header
                  >
                  <v-expansion-panel-content>
                    <ul v-for="team in team.teams" :key="team.teams">
                      <li>
                        <strong>{{ teamStandings[team].wins }}</strong>
                        <span class="team-name">{{
                          teamStandings[team].name
                        }}</span>
                      </li>
                    </ul>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
const ENDPOINT = "http://localhost:7777/standings";
import players from "../data/players.js";

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
        // if (process.env.NODE_ENV === "development") {
        //   this.runData = testData;
        // } else {
        /* eslint-disable no-constant-condition */
        /// while (true) {
        const teamStandings = await fetch(ENDPOINT).then((r) => r.json());

        this.dateFetched = new Date(teamStandings.full_date).toLocaleString();

        const currentStandings =
          teamStandings.standings[teamStandings.standings.length - 1].team;

        // if (data.length < 1) {
        //   break;
        // }

        const poolStandings = players.map((player) => {
          // console.log(player.teams);
          // console.log(currentStandings);

          const wins = player.teams.reduce((acc, team) => {
            return acc + currentStandings[team].wins;
          }, 0);

          return {
            id: player.id,
            name: player.name,
            wins,
            teams: player.teams,
          };
        });

        poolStandings.sort((a, b) => b.wins - a.wins);

        this.poolStandings = poolStandings;
        this.teamStandings = currentStandings;

        // this.runData = [...this.runData, ...data];

        // page++;
        //} // end while
        /* eslint-enable no-constant-condition */
        // }
        //    this.isLoading = false;
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
