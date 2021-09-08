/* Simple script to iterate through dates, caching
standings data over time for use in timeline */

const fetch = require("node-fetch");
require("dotenv").config({ path: "../.env" });
const admin = require("firebase-admin");

const players = [
  {
    id: "adam-p",
    name: "Adam P",
    color: "Crimson",
    teams: [
      "cincinnati-reds",
      "miami-marlins",
      "new-york-mets",
      "new-york-yankees",
      "oakland-athletics",
    ],
  },
  {
    id: "chris-g",
    name: "Chris G",
    color: "SteelBlue",
    teams: [
      "atlanta-braves",
      "boston-red-sox",
      "milwaukee-brewers",
      "minnesota-twins",
      "san-diego-padres",
    ],
  },
  {
    id: "chris-w",
    name: "Chris W",
    color: "Moccasin",
    teams: [
      "arizona-diamondbacks",
      "chicago-cubs",
      "los-angeles-dodgers",
      "new-york-yankees",
      "texas-rangers",
    ],
  },
  {
    id: "corey",
    name: "Corey",
    color: "MediumSlateBlue",
    teams: [
      "chicago-white-sox",
      "los-angeles-angels",
      "milwaukee-brewers",
      "new-york-mets",
      "st-louis-cardinals",
    ],
  },
  {
    id: "jamie-o",
    name: "Jamie O",
    color: "Fuchsia",
    teams: [
      "houston-astros",
      "miami-marlins",
      "new-york-yankees",
      "tampa-bay-rays",
      "washington-nationals",
    ],
  },
  {
    id: "jeff-u",
    name: "Jeff U",
    color: "Lime",
    teams: [
      "chicago-cubs",
      "los-angeles-dodgers",
      "miami-marlins",
      "milwaukee-brewers",
      "new-york-yankees",
    ],
  },
  {
    id: "joe-g",
    name: "Joe G",
    color: "OliveDrab",
    teams: [
      "chicago-cubs",
      "cleveland-indians",
      "new-york-yankees",
      "san-diego-padres",
      "st-louis-cardinals",
    ],
  },
  {
    id: "joe-p",
    name: "Joe P",
    color: "MediumBlue",
    teams: [
      "chicago-cubs",
      "los-angeles-dodgers",
      "miami-marlins",
      "new-york-yankees",
      "philadelphia-phillies",
    ],
  },
  {
    id: "joseph-jr",
    name: "Joseph Jr.",
    color: "LightSalmon",
    teams: [
      "chicago-white-sox",
      "miami-marlins",
      "new-york-mets",
      "oakland-athletics",
      "tampa-bay-rays",
    ],
  },
  {
    id: "kennie",
    name: "Kennie",
    color: "Crimson",
    teams: [
      "atlanta-braves",
      "chicago-cubs",
      "houston-astros",
      "los-angeles-angels",
      "new-york-yankees",
    ],
  },
  {
    id: "melissa",
    name: "Melissa",
    color: "Gold",
    teams: [
      "atlanta-braves",
      "boston-red-sox",
      "houston-astros",
      "san-diego-padres",
      "st-louis-cardinals",
    ],
  },
  {
    id: "mitch",
    name: "Mitch",
    color: "Fuchsia",
    teams: [
      "chicago-cubs",
      "los-angeles-angels",
      "los-angeles-dodgers",
      "milwaukee-brewers",
      "san-diego-padres",
    ],
  },
  {
    id: "ryan-d",
    name: "Ryan D",
    color: "DarkViolet",
    teams: [
      "chicago-cubs",
      "kansas-city-royals",
      "los-angeles-angels",
      "los-angeles-dodgers",
      "new-york-yankees",
    ],
  },
  {
    id: "ryan-m",
    name: "Ryan M",
    color: "GreenYellow",
    teams: [
      "atlanta-braves",
      "boston-red-sox",
      "chicago-white-sox",
      "los-angeles-angels",
      "san-diego-padres",
    ],
  },
  {
    id: "sparks",
    name: "Sparks",
    color: "YellowGreen",
    teams: [
      "los-angeles-angels",
      "milwaukee-brewers",
      "minnesota-twins",
      "new-york-yankees",
      "philadelphia-phillies",
    ],
  },
  {
    id: "stephen-m",
    name: "Stephen M",
    color: "Turquoise",
    teams: [
      "atlanta-braves",
      "chicago-cubs",
      "chicago-white-sox",
      "new-york-yankees",
      "san-francisco-giants",
    ],
  },
  {
    id: "steve-s",
    name: "Steve S",
    color: "DeepSkyBlue",
    teams: [
      "boston-red-sox",
      "chicago-cubs",
      "houston-astros",
      "los-angeles-dodgers",
      "san-diego-padres",
    ],
  },
];

const buff = new Buffer.from(process.env.PRIVATE_KEY, "base64");
const private_key = buff.toString("utf8");

const FIREBASE_CONFIG = {
  type: "service_account",
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: private_key,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
};

const fetchPoolStandings = async function(ENDPOINT) {
  // Save db reference
  // const db = admin.firestore();

  const teamStandings = await fetch(ENDPOINT).then((r) => r.json());

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

  return poolStandings;
};

const ENDPOINT = "http://localhost:8888/.netlify/functions/standings";

// Start of 2021 Baseball Season
const START_DATE = "2021-07-30";

const END_DATE = "2021-09-05";

const saveTimeline = async function() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(FIREBASE_CONFIG),
    });
  }

  // Save db reference
  const db = admin.firestore();

  let full_date = new Date(START_DATE);
  let end_date = new Date(END_DATE);

  // let now = new Date();

  let date = full_date.toISOString().split("T")[0];

  let saveTimeline;

  let labels = [];
  let standingsMap = {};
  players.forEach((player) => {
    standingsMap[player.id] = {};
  });

  saveTimeline = setInterval(async function() {
    console.log({ full_date });
    console.log({ date });

    const poolStandings = await fetchPoolStandings(`${ENDPOINT}?date=${date}`);

    // console.log({poolStandings});

    labels.push(date);

    // Loop through poolStandings, adding to standingsMap
    poolStandings.forEach(async (player) => {
      // console.log({player})
      // console.log(standingsMap[player.id])
      standingsMap[player.id][date] = player.wins;

      await db
        .collection("timeline")
        .doc(player.id)
        .update({ [date]: player.wins });
    });

    // increment date
    full_date.setDate(full_date.getDate() + 1);
    date = full_date.toISOString().split("T")[0];

    // Exit
    if (full_date > end_date) {
      clearInterval(saveTimeline);
      console.log(standingsMap);
    }
  }, 500);
};

saveTimeline();
