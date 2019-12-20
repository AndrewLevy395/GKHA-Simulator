const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const server = require("http").createServer(app);
const mongodb = require("mongodb");
const cors = require("cors");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

//cors
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
};

app.use(cors(corsOptions));

app.get("/cors-entry", function(req, res, next) {
  console.log("CORS Accessed");
  res.json({ msg: "CORS-enabled for all origins!" });
});

//body parser
app.use(bodyParser.json());

// check production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

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

//viewing session in mongo
const store = new MongoDBStore({
  uri: uri,
  collection: "sessions"
});
store.on("error", function(error) {
  console.log(error);
});

//session
app.use(
  session({
    secret: "gkha secret sauce",
    store: store
  })
);

//add user with all default season information
app.post("/addfranchise", function(req, res) {
  const data = {
    username: req.body.username,
    userteam: req.body.userteam,
    alaskaSeason: {
      team: "Alaskan Thunder",
      wins: 0,
      losses: 0,
      overtime: 0,
      points: 0,
      goalsFor: 0,
      goalsAllowed: 0,
      forward: "Erik Galuska",
      dforward: "Andrew Levy",
      goalie: "Ricky Novia"
    },
    americaSeason: {
      team: "American Revolution",
      wins: 0,
      losses: 0,
      overtime: 0,
      points: 0,
      goalsFor: 0,
      goalsAllowed: 0,
      forward: "Mikey Papa",
      dforward: "Owen Brown",
      goalie: "Mike Marotta"
    },
    boondockSeason: {
      team: "Boondock Beluga Whales",
      wins: 0,
      losses: 0,
      overtime: 0,
      points: 0,
      goalsFor: 0,
      goalsAllowed: 0,
      forward: "Austin Ingarra",
      dforward: "Darren Barille",
      goalie: "Alec Fowler"
    },
    floridaSeason: {
      team: "Florida Tropics",
      wins: 0,
      losses: 0,
      overtime: 0,
      points: 0,
      goalsFor: 0,
      goalsAllowed: 0,
      forward: "Aidan Murray",
      dforward: "Chris Horowitz",
      goalie: "Collin Salatto"
    },
    smashvilleSeason: {
      team: "Smashville Chippewas",
      wins: 0,
      losses: 0,
      overtime: 0,
      points: 0,
      goalsFor: 0,
      goalsAllowed: 0,
      forward: "Sal DeLucia",
      dforward: "Vinny Cleary",
      goalie: "Tom Bishop"
    },
    southsideSeason: {
      team: "Southside Spartans",
      wins: 0,
      losses: 0,
      overtime: 0,
      points: 0,
      goalsFor: 0,
      goalsAllowed: 0,
      forward: "Chris Papa",
      dforward: "Erik Levenduski",
      goalie: "Matt Palma"
    },
    freeAgents: [
      "Matt Robidoux",
      "Brad Robidoux",
      "Ian Beling",
      "George Bonadies"
    ],
    futurePlayers: [
      "Couch Cushion",
      "Devin Savold",
      "Jar of Peanut Butter",
      "Jarrett Hissick",
      "Kyle Kulthau",
      "Maddy Levy",
      "Marco Dugay",
      "Shem Prudhomme"
    ],
    seasonInfo: { week: 1 },
    testValue: 0
  };
  try {
    franchiseColl.insertOne(data).then(result => res.json(result));
  } catch (e) {
    console.log(e + "ERROR HERE");
  }
});

//increment the week after viewing week results
app.post("/incrementweek", function(req, res) {
  franchiseColl.findOne({ username: req.session.user }, function(err, bdata) {
    if (err) {
      return done(err);
    }
    franchiseColl.updateOne(
      { username: req.session.user },
      {
        $inc: {
          "seasonInfo.week": 1
        }
      }
    );
  });
  res.end();
});

//remove the username from the session
app.post("/usernamerem", function(req, res) {
  req.session.user = "";
  req.session.save();
  res.end();
});

//set the username of the session
app.post("/usernameset", function(req, res) {
  req.session.user = req.body.username;
  req.session.save();
  res.end();
});

//check if the username is in the database already
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

//increment the record of the team
app.post("/setrecord", function(req, res) {
  franchiseColl.findOne({ username: req.session.user }, function(err, bdata) {
    if (err) {
      return done(err);
    }
    let seasonTeams = [
      {
        teamdata: bdata.alaskaSeason,
        win: 0,
        lose: 0,
        overtime: 0,
        goals: 0,
        allowed: 0
      },
      {
        teamdata: bdata.americaSeason,
        win: 0,
        lose: 0,
        overtime: 0,
        goals: 0,
        allowed: 0
      },
      {
        teamdata: bdata.boondockSeason,
        win: 0,
        lose: 0,
        overtime: 0,
        goals: 0,
        allowed: 0
      },
      {
        teamdata: bdata.floridaSeason,
        win: 0,
        lose: 0,
        overtime: 0,
        goals: 0,
        allowed: 0
      },
      {
        teamdata: bdata.smashvilleSeason,
        win: 0,
        lose: 0,
        overtime: 0,
        goals: 0,
        allowed: 0
      },
      {
        teamdata: bdata.southsideSeason,
        win: 0,
        lose: 0,
        overtime: 0,
        goals: 0,
        allowed: 0
      }
    ];
    for (let i = 0; i < seasonTeams.length; i++) {
      if (req.body.result.team === seasonTeams[i].teamdata.team) {
        if (req.body.status === "win") {
          seasonTeams[i].win++;
          seasonTeams[i].goals = req.body.result.wingoals;
          seasonTeams[i].allowed = req.body.result.losegoals;
          franchiseColl.updateOne(
            { username: req.session.user },
            {
              $inc: {
                "alaskaSeason.wins": seasonTeams[0].win,
                "americaSeason.wins": seasonTeams[1].win,
                "boondockSeason.wins": seasonTeams[2].win,
                "floridaSeason.wins": seasonTeams[3].win,
                "smashvilleSeason.wins": seasonTeams[4].win,
                "southsideSeason.wins": seasonTeams[5].win,
                "alaskaSeason.points": seasonTeams[0].win * 2,
                "americaSeason.points": seasonTeams[1].win * 2,
                "boondockSeason.points": seasonTeams[2].win * 2,
                "floridaSeason.points": seasonTeams[3].win * 2,
                "smashvilleSeason.points": seasonTeams[4].win * 2,
                "southsideSeason.points": seasonTeams[5].win * 2,
                "alaskaSeason.goalsFor": seasonTeams[0].goals,
                "americaSeason.goalsFor": seasonTeams[1].goals,
                "boondockSeason.goalsFor": seasonTeams[2].goals,
                "floridaSeason.goalsFor": seasonTeams[3].goals,
                "smashvilleSeason.goalsFor": seasonTeams[4].goals,
                "southsideSeason.goalsFor": seasonTeams[5].goals,
                "alaskaSeason.goalsAllowed": seasonTeams[0].allowed,
                "americaSeason.goalsAllowed": seasonTeams[1].allowed,
                "boondockSeason.goalsAllowed": seasonTeams[2].allowed,
                "floridaSeason.goalsAllowed": seasonTeams[3].allowed,
                "smashvilleSeason.goalsAllowed": seasonTeams[4].allowed,
                "southsideSeason.goalsAllowed": seasonTeams[5].allowed
              }
            }
          );
        } else if (req.body.status === "lose") {
          seasonTeams[i].lose++;
          seasonTeams[i].goals = req.body.result.losegoals;
          seasonTeams[i].allowed = req.body.result.wingoals;
          franchiseColl.updateOne(
            { username: req.session.user },
            {
              $inc: {
                "alaskaSeason.losses": seasonTeams[0].lose,
                "americaSeason.losses": seasonTeams[1].lose,
                "boondockSeason.losses": seasonTeams[2].lose,
                "floridaSeason.losses": seasonTeams[3].lose,
                "smashvilleSeason.losses": seasonTeams[4].lose,
                "southsideSeason.losses": seasonTeams[5].lose,
                "alaskaSeason.goalsFor": seasonTeams[0].goals,
                "americaSeason.goalsFor": seasonTeams[1].goals,
                "boondockSeason.goalsFor": seasonTeams[2].goals,
                "floridaSeason.goalsFor": seasonTeams[3].goals,
                "smashvilleSeason.goalsFor": seasonTeams[4].goals,
                "southsideSeason.goalsFor": seasonTeams[5].goals,
                "alaskaSeason.goalsAllowed": seasonTeams[0].allowed,
                "americaSeason.goalsAllowed": seasonTeams[1].allowed,
                "boondockSeason.goalsAllowed": seasonTeams[2].allowed,
                "floridaSeason.goalsAllowed": seasonTeams[3].allowed,
                "smashvilleSeason.goalsAllowed": seasonTeams[4].allowed,
                "southsideSeason.goalsAllowed": seasonTeams[5].allowed
              }
            }
          );
        } else if (req.body.status === "overtime") {
          seasonTeams[i].overtime++;
          seasonTeams[i].goals = req.body.result.losegoals;
          seasonTeams[i].allowed = req.body.result.wingoals;
          franchiseColl.updateOne(
            { username: req.session.user },
            {
              $inc: {
                "alaskaSeason.overtime": seasonTeams[0].overtime,
                "americaSeason.overtime": seasonTeams[1].overtime,
                "boondockSeason.overtime": seasonTeams[2].overtime,
                "floridaSeason.overtime": seasonTeams[3].overtime,
                "smashvilleSeason.overtime": seasonTeams[4].overtime,
                "southsideSeason.overtime": seasonTeams[5].overtime,
                "alaskaSeason.points": seasonTeams[0].overtime,
                "americaSeason.points": seasonTeams[1].overtime,
                "boondockSeason.points": seasonTeams[2].overtime,
                "floridaSeason.points": seasonTeams[3].overtime,
                "smashvilleSeason.points": seasonTeams[4].overtime,
                "southsideSeason.points": seasonTeams[5].overtime,
                "alaskaSeason.goalsFor": seasonTeams[0].goals,
                "americaSeason.goalsFor": seasonTeams[1].goals,
                "boondockSeason.goalsFor": seasonTeams[2].goals,
                "floridaSeason.goalsFor": seasonTeams[3].goals,
                "smashvilleSeason.goalsFor": seasonTeams[4].goals,
                "southsideSeason.goalsFor": seasonTeams[5].goals,
                "alaskaSeason.goalsAllowed": seasonTeams[0].allowed,
                "americaSeason.goalsAllowed": seasonTeams[1].allowed,
                "boondockSeason.goalsAllowed": seasonTeams[2].allowed,
                "floridaSeason.goalsAllowed": seasonTeams[3].allowed,
                "smashvilleSeason.goalsAllowed": seasonTeams[4].allowed,
                "southsideSeason.goalsAllowed": seasonTeams[5].allowed
              }
            }
          );
        }
      }
    }
    return res.end();
  });
});

//get team data for all teams
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

//get the week
app.get("/weekget", function(req, res) {
  let franchise;

  franchiseColl.findOne({ username: req.session.user }, function(err, bdata) {
    if (err) {
      return done(err);
    }
    franchise = bdata.seasonInfo.week;
    return res.end(JSON.stringify(franchise));
  });
});

//get the username of the session
app.get("/userteamget", function(req, res) {
  let franchise;

  franchiseColl.findOne({ username: req.session.user }, function(err, bdata) {
    if (err) {
      return done(err);
    }
    franchise = bdata.userteam;
    return res.end(JSON.stringify(franchise));
  });
});

//get the userteam of the session
app.get("/usernameget", function(req, res) {
  res.end(req.session.user);
});

//server
app.applyPort = function(port) {
  server.listen(port);
  let message = "listening on port: " + port;
  console.log(message);
};

app.applyPort(8080);

module.exports = app;
