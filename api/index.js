const express = require("express");
const axios = require("axios");
const data = require("./data/standings.json");

// create our Express app
const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", async (req, res) => {
  res.send("OK Bob.");
});

app.get("/standings", async (req, res) => {
  const endpoint = `https://erikberg.com/mlb/standings.json`;

  try {
    let { data } = await axios.get(endpoint);

    const full_date = data.standings_date;

    // Parse the date
    const date = full_date.split("T")[0];

    const standings = [];

    const day = {
      date,
      team: {},
    };

    data.standing.forEach((team) => {
      day.team[team.team_id] = {
        name: `${team.first_name} ${team.last_name}`,
        wins: team.won,
      };
    });

    standings.push(day);

    res.send({ full_date, standings });
  } catch (error) {
    console.error(error);
  }
});

app.set("port", process.env.PORT || 7777);
const server = app.listen(app.get("port"), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
