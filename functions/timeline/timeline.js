require("dotenv").config();
const admin = require("firebase-admin");

const { fetchPoolStandings } = require(`../../src/api/api.js`);

const API_ENDPOINT = `${process.env.API_HOST}/.netlify/functions/standings`;

/* Private key is base64 encoded in Netlify UI b/c it 
doesn't deal well with escaped characters, e.g, \n 
So let's decode that first! */
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

exports.handler = async ({ queryStringParameters }) => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(FIREBASE_CONFIG),
    });
  }

  // Save db reference
  const db = admin.firestore();

  // Check for particular date
  const { player, startDate, endDate } = queryStringParameters;

  if (!player) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "No player specificed",
      }),
    };
  }

  const playerRef = db.collection("timeline").doc(player);
  const doc = await playerRef.get();
  if (doc.exists) {
    const teamStandings = doc.data();

    let full_date = new Date(startDate);
    let end_date = new Date(endDate);

    let standings = [];

    while (full_date < end_date) {
      const date = full_date.toISOString().split("T")[0];

      if (date in teamStandings) {
        standings.push(teamStandings[date]);
      } else {
        console.log(`${date} is missing, trying to fetch...`);

        const wins = await fetchMissingData(date, player);

        if (wins) {
          // @ save in firebase
          standings.push(wins);
          playerRef.update({ [date]: wins });
        }
      }
      // increment date
      full_date.setDate(full_date.getDate() + 1);
    }

    console.log("IN TIMELINE", standings);

    return {
      statusCode: 200,
      body: JSON.stringify(standings),
    };
  } else {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Player not found",
      }),
    };
  }
};

const fetchMissingData = async function(date, player) {
  const { poolStandings } = await fetchPoolStandings(
    `${API_ENDPOINT}?date=${date}`
  );

  const found = poolStandings.find((team) => team.id === player);

  if (!found) return;

  return found.wins;
};
