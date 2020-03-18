const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const server = require("http").createServer(app);
const mongodb = require("mongodb");
const cors = require("cors");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const teamlist = require("./src/components/data/teamlist");
const playerstats = require("./src/components/data/playerstats");

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
    teams: teamlist,
    playerStats: playerstats,
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
    playoffTeams: [],
    seasonInfo: { week: 1 },
    testValue: 0
  };
  franchiseColl.findOne({ username: req.body.username }, function(err, bdata) {
    if (err) {
      return done(err);
    }
    if (bdata) {
      res.end("invalid");
    } else {
      try {
        franchiseColl.insertOne(data).then(result => res.json(result));
      } catch (e) {
        console.log(e + "ERROR HERE");
      }
    }
  });
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
    for (let i = 0; i < bdata.teams.length; i++) {
      let winValue = `teams.${i}.wins`;
      let loseValue = `teams.${i}.losses`;
      let overtimeValue = `teams.${i}.overtime`;
      let pointValue = `teams.${i}.points`;
      let goalsForValue = `teams.${i}.goalsFor`;
      let goalsAllowedValue = `teams.${i}.goalsAllowed`;
      if (req.body.result.team === bdata.teams[i].team) {
        if (req.body.status === "win") {
          franchiseColl.updateOne(
            { username: req.session.user },
            {
              $inc: {
                [winValue]: 1,
                [pointValue]: 2,
                [goalsForValue]: req.body.result.wingoals,
                [goalsAllowedValue]: req.body.result.losegoals
              }
            }
          );
        } else if (req.body.status === "lose") {
          franchiseColl.updateOne(
            { username: req.session.user },
            {
              $inc: {
                [loseValue]: 1,
                [goalsForValue]: req.body.result.losegoals,
                [goalsAllowedValue]: req.body.result.wingoals
              }
            }
          );
        } else if (req.body.status === "overtime") {
          franchiseColl.updateOne(
            { username: req.session.user },
            {
              $inc: {
                [overtimeValue]: 1,
                [pointValue]: 1,
                [goalsForValue]: req.body.result.losegoals,
                [goalsAllowedValue]: req.body.result.wingoals
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
    franchise = bdata.teams;
    return res.end(JSON.stringify(franchise));
  });
});

//get team data for all playoff teams
app.get("/playoffteamsget", function(req, res) {
  let franchise;
  franchiseColl.findOne({ username: req.session.user }, function(err, bdata) {
    if (err) {
      return done(err);
    }
    franchise = bdata.playoffTeams;
    return res.end(JSON.stringify(franchise));
  });
});

//get team data for all playoff teams
app.get("/playerstatsget", function(req, res) {
  let players;
  franchiseColl.findOne({ username: req.session.user }, function(err, bdata) {
    if (err) {
      return done(err);
    }
    players = bdata.playerStats;
    return res.end(JSON.stringify(players));
  });
});

//set the playoff teams
app.post("/playoffset", function(req, res) {
  let franchise;
  franchiseColl.findOne({ username: req.session.user }, function(err, bdata) {
    if (err) {
      return done(err);
    }
    franchise = bdata.seasonInfo.week;
    franchiseColl.updateOne(
      { username: req.session.user },
      { $set: { playoffTeams: req.body } }
    );
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
