let fetch;

if (typeof fetch === "undefined") {
  fetch = require("node-fetch");
}

const { players } = require("../data/players.json");

module.exports.fetchPoolStandings = async function(ENDPOINT) {
  const teamStandings = await fetch(ENDPOINT).then((r) => r.json());

  const dateFetched = new Date(teamStandings.full_date).toLocaleString();

  const currentStandings =
    teamStandings.standings[teamStandings.standings.length - 1].team;

  const poolStandings = players.map((player) => {
    const teams = player.teams
      .map((team) => {
        return {
          id: team,
          name: currentStandings[team].name,
          wins: currentStandings[team].wins,
        };
      })
      .sort((a, b) => b.wins - a.wins);

    const wins = player.teams.reduce((acc, team) => {
      return acc + currentStandings[team].wins;
    }, 0);

    return {
      id: player.id,
      name: player.name,
      wins,
      teams,
    };
  });

  poolStandings.sort((a, b) => b.wins - a.wins);

  return { dateFetched, poolStandings, teamStandings: currentStandings };
};

// Fetches timesline formated as an object, returns an array of data
module.exports.fetchTimeline = async function({
  endpoint,
  startDate,
  endDate,
}) {
  const teamStandings = await fetch(endpoint).then((r) => r.json());

  let full_date = new Date(startDate);
  let end_date = new Date(endDate);

  let standings = [];

  console.log({ teamStandings });

  while (full_date < end_date) {
    const date = full_date.toISOString().split("T")[0];

    if (date in teamStandings) {
      standings.push(teamStandings[date]);
    } else {
      console.log(`${date} is missing, trying to fetch...`);
    }

    // Create single array of data

    // Fill in missing data if applicable

    // @todo API call if data is missing here

    // // console.log({ date });
    // // console.log({standingsMap});

    // const {
    //   poolStandings
    // } = await fetchPoolStandings(`${ENDPOINT}?date=${date}`);

    // labels.push(date)

    // // Loop through poolStandings, adding to standingsMap
    // poolStandings.forEach( player => {
    //   // console.log({player})
    //   // console.log(standingsMap[player.id])
    //   standingsMap[player.id].push(player.wins);
    // })

    // increment date
    full_date.setDate(full_date.getDate() + 1);
  }

  return standings;

  // return { dateFetched, poolStandings, teamStandings: currentStandings };
};
