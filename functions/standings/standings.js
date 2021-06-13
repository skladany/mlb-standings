const fetch = require("node-fetch");
const fs = require("fs");

const API_ENDPOINT = "https://erikberg.com/mlb/standings.json";

exports.handler = async (req) => {
  const { date: req_date } = req.queryStringParameters;
  console.log(`REQ ${req_date}`);

  // Look for cached copy of data
  if (req_date != undefined) {
    try {
      console.log(`Returning cached data for ${req_date}`);
      const data = fs.readFileSync(`./public/data/${req_date}.json`, "utf8");
      const json = JSON.parse(data);
      json.cached = true;
      return {
        statusCode: 200,
        body: JSON.stringify(json),
      };
    } catch (err) {
      console.log(`${req_date} has not been cached.`);
      console.error(err);
    }
  }

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
      `./public/data/${date}.json`,
      JSON.stringify({ full_date, standings }),
      function(err) {
        if (err) return console.log(err);
        console.log(`Saving JSON data for ${date}`);
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ full_date, standings, cached: false }),
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
