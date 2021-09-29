require("dotenv").config();
const fetch = require("node-fetch");
const admin = require("firebase-admin");

const API_ENDPOINT = "https://erikberg.com/mlb/";

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

const writeLogs = async function(db, headers) {
  // Write logs
  // const userAgent = headers["user-agent"];
  // const referer = headers.referer;
  const timestamp = new Date();

  const logs = await db
    .collection("logs")
    .doc()
    .set({ timestamp, headers });

  console.log("writeLogs Result", logs);
};

exports.handler = async ({ queryStringParameters, headers }) => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(FIREBASE_CONFIG),
    });
  }

  // Save db reference
  const db = admin.firestore();

  // Check for particular date
  const { date: date } = queryStringParameters;

  // Try to look for cached copy of data
  if (date) {
    const dateRef = db.collection("standings").doc(date);
    const doc = await dateRef.get();
    if (doc.exists) {
      console.log("Cached Standings found!");
      const { full_date, standings } = doc.data();

      writeLogs(db, headers);

      return {
        statusCode: 200,
        body: JSON.stringify({ full_date, standings, cached: true }),
      };
    }
  } else console.log("No Cache exists, Hitting API");

  const apiCall = date
    ? "standings/" + date.replace(/-g/, "") + ".json"
    : "standings.json";

  const reqHeaders = {
    Authorization: "Bearer " + process.env.ACCESS_TOKEN,
    "User-Agent": "MLB Standings (mlb.postal.run, skladany.net)",
  };

  let response, data, full_date, standings;
  try {
    console.log({ reqHeaders });

    response = await fetch(API_ENDPOINT + apiCall, {
      headers: reqHeaders,
    });

    data = await response.json();

    console.log({ data });

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

    // Save a copy of this data in firestore
    const result = await db
      .collection("standings")
      .doc(date)
      .set({ full_date, standings });

    console.log("Result", result);
    writeLogs(db, headers);

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
