require("dotenv").config();
const fetch = require("node-fetch");
const admin = require("firebase-admin");

const API_ENDPOINT = "https://erikberg.com/mlb/standings.json";

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

exports.handler = async ({ queryStringParameters, headers }) => {
  const { date: req_date } = queryStringParameters;
  console.log({ req_date });

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(FIREBASE_CONFIG),
    });
  }

  // Look for cached copy of data
  // if (req_date != undefined) {
  //   try {
  //     console.log(`Returning cached data for ${req_date}`);
  //     const data = fs.readFileSync(`./public/data/${req_date}.json`, "utf8");
  //     const json = JSON.parse(data);
  //     json.cached = true;
  //     return {
  //       statusCode: 200,
  //       body: JSON.stringify(json),
  //     };
  //   } catch (err) {
  //     console.log(`${req_date} has not been cached.`);
  //     console.error(err);
  //   }
  // }

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

    // Save a copy of this data in firestore
    const result = await admin
      .firestore()
      .collection("standings")
      .doc(date)
      .set({ full_date, standings });

    console.log("Result", result);

    // Save a local copy of this data
    // const saveFile = `${process.cwd()}/public/data/${date}.json`;

    // fs.writeFile(saveFile, JSON.stringify({ full_date, standings }), function(
    //   err
    // ) {
    //   if (err) return console.log(err);
    //   console.log(`Saving JSON data for ${date} in ${saveFile}`);
    // });

    // Write logs
    // const userAgent = headers["user-agent"];
    // const referer = headers.referer;
    const timestamp = new Date();

    const logs = await admin
      .firestore()
      .collection("logs")
      .doc()
      .set({ timestamp, headers });

    console.log("Result", logs);

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
