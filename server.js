const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const server = require("http").createServer(app);
const mongodb = require("mongodb");
const cors = require("cors");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//cors
app.get("/cors-entry", function(req, res, next) {
  console.log("CORS Accessed");
  res.json({ msg: "CORS-enabled for all origins!" });
});

//mongodb
let franchiseColl = null;
const uri =
  "mongodb+srv://andy:" +
  process.env.PASS +
  "@cluster0-zovad.mongodb.net/test?retryWrites=true&w=majority";
const client = new mongodb.MongoClient(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
client.connect(err => {
  franchiseColl = client.db("GKHAdatabase").collection("franchises");
  client.close;
});

const store = new MongoDBStore({
  uri: uri,
  collection: "sessions"
});
store.on("error", function(error) {
  console.log(error);
});

app.use(
  session({
    secret: "gkha secret sauce",
    store: store
  })
);

//add user
app.post("/addfranchise", function(req, res) {
  const data = {
    username: req.body.username,
    userteam: req.body.userteam,
    alaskaSeason: ["Alaskan Thunder", 0, 0, "Andrew Levy", "Ricky Novia"],
    americaSeason: ["American Revolution", 0, 0, "Mikey Papa", "Mike Marotta"],
    boondockSeason: [
      "Boondock Beluga Whales",
      0,
      0,
      "Austin Ingarra",
      "Alec Fowler"
    ],
    floridaSeason: [
      "Florida Tropics",
      0,
      0,
      "Chris Horowitz",
      "Collin Salatto"
    ],
    smashvilleSeason: [
      "Smashville Chippewas",
      0,
      0,
      "Sal Delucia",
      "Tom Bishop"
    ],
    southsideSeason: [
      "Southside Spartans",
      0,
      0,
      "Chris Papa",
      "Matthew Palma"
    ],
    seasonInfo: [1]
  };
  try {
    franchiseColl.insertOne(data).then(result => res.json(result));
  } catch (e) {
    console.log(e + "ERROR HERE");
  }
});

app.post("/usernamerem", function(req, res) {
  req.session.user = "";
  req.session.save();
  res.end();
});

app.post("/usernameset", function(req, res) {
  req.session.user = req.body.username;
  req.session.save();
  res.end();
});

app.post("/usernamecheck", function(req, res) {
  let franchise;
  franchiseColl.findOne({ username: req.body.username }, function(err, bdata) {
    if (err) {
      return done(err);
    }
    if (bdata) {
      franchise = JSON.stringify(bdata.username);
    } else {
      franchise = "invalid";
    }
    return res.end(franchise);
  });
});

app.get("/teamsget", function(req, res) {
  let franchise;

  franchiseColl.findOne({ username: req.session.user }, function(err, bdata) {
    if (err) {
      return done(err);
    }
    franchise = bdata;
    return res.end(JSON.stringify(franchise));
  });
});

app.get("/weekget", function(req, res) {
  let franchise;

  franchiseColl.findOne({ username: req.session.user }, function(err, bdata) {
    if (err) {
      return done(err);
    }
    franchise = bdata.seasonInfo[0];
    return res.end(JSON.stringify(franchise));
  });
});

app.get("/usernameget", function(req, res) {
  res.end(req.session.user);
});

app.applyPort = function(port) {
  server.listen(port);
  let message = "listening on port: " + port;
  console.log(message);
};

app.applyPort(8080);

module.exports = app;
