import players from "../data/players.js";

const fetchPoolStandings = async function(ENDPOINT) {
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

export { fetchPoolStandings };
