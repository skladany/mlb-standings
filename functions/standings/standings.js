const fetch = require("node-fetch");
const fs = require("fs");

const API_ENDPOINT = "https://erikberg.com/mlb/standings.json";

exports.handler = async () => {
  let response, data, full_date, standings;
  try {
    response = await fetch(API_ENDPOINT);
    data = await response.json();

    full_date = data.standings_date;

    // Parse the date
    const date = full_date.split("T")[0];

    standings = [];

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

    // Save a local copy of this data
    fs.writeFile(
      `./data/${date}.json`,
      JSON.stringify({ full_date, standings }),
      function(err) {
        if (err) return console.log(err);
        console.log(`Saving JSON data for ${date}`);
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ full_date, standings }),
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({
        error: err.message,
      }),
    };
  }
};
