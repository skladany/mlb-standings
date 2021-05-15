<template>
  <v-app>
    <v-main>
      <Standings />
    </v-main>
  </v-app>
</template>

<script>
import Standings from "./components/Standings";

export default {
  name: "App",

  components: {
    Standings,
  },

  data: () => ({
    //
  }),
};
</script>
