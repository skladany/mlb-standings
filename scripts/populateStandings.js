/* Simple script to iterate through dates, which will 
cause the lambda function to cache the standings data */

const fetch = require("node-fetch");

const ENDPOINT = "http://localhost:8888/.netlify/functions/standings";

// Start of 2021 Baseball Season
const START_DATE = "2021-04-28";

const fetchStandings = async function() {
  let full_date = new Date(START_DATE);
  let now = new Date();

  let date = full_date.toISOString().split("T")[0];

  let populateStandings;

  populateStandings = setInterval(async function() {
    date = full_date.toISOString().split("T")[0];
    console.log({ date });

    const result = await fetch(`${ENDPOINT}?date=${date}`);
    console.log(result.url);

    // increment date
    full_date.setDate(full_date.getDate() + 1);

    // Exit
    if (full_date > now) clearInterval(populateStandings);
  }, 11000);
};

fetchStandings();
