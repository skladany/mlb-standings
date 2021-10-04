<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row class="text-center">
          <v-col>
            <h1 style="margin-bottom:20px">Baseball 2021</h1>
            <v-card>
              <v-tabs v-model="tab" centered dark icons-and-text>
                <v-tabs-slider></v-tabs-slider>

                <v-tab href="#standings">
                  Standings
                  <v-icon>mdi-format-list-numbered</v-icon>
                </v-tab>

                <v-tab href="#timeline">
                  Timeline
                  <v-icon>mdi-chart-timeline-variant</v-icon>
                </v-tab>
              </v-tabs>

              <v-tabs-items v-model="tab">
                <v-tab-item value="standings">
                  <Standings />
                </v-tab-item>
                <v-tab-item value="timeline">
                  <Timeline />
                </v-tab-item>
              </v-tabs-items>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Standings from "./components/Standings";
import Timeline from "./components/Timeline.vue";

export default {
  name: "App",

  components: {
    Standings,
    Timeline,
  },

  data: () => ({
    tab: null,
  }),
};
</script>
