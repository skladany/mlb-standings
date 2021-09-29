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
module.exports.fetchTimeline = async function(ENDPOINT) {
  const standings = await fetch(ENDPOINT).then((r) => r.json());

  return standings;
};
