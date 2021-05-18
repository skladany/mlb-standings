const fetch = require("node-fetch");

const API_ENDPOINT = "https://erikberg.com/mlb/standings.json";

exports.handler = async (event, context) => {
  let response, json, data, full_date, standings;
  try {
    response = await fetch(API_ENDPOINT);
    json = await response.json();

    //full_date = data.standings_date;

    // // Parse the date
    // const date = full_date.split("T")[0];

    // standings = [];

    // const day = {
    //   date,
    //   team: {},
    // };

    // data.standing.forEach((team) => {
    //   day.team[team.team_id] = {
    //     name: `${team.first_name} ${team.last_name}`,
    //     wins: team.won,
    //   };
    // });

    // standings.push(day);
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({
        error: err.message,
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      // data: { full_date, standings },
      data: json,
    }),
  };
};
