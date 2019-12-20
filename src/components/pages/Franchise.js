import React from "react";
import schedule from "../data/schedule";
import playerlist from "../data/playerlist";
import { Redirect } from "react-router-dom";

class Franchise extends React.Component {
  state = {
    username: "",
    userteam: "",
    week: "",
    redirect: false,
    calcredirect: false,
    teamsStats: [],
    game1: [],
    game2: [],
    game3: []
  };

  //on page open
  componentDidMount() {
    this.getTeams();
    this.getWeek();
    this.getUsername();
    this.getUserteam();
  }

  //gets username of player
  getUsername = () => {
    fetch("http://localhost:8080/usernameget", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    })
      .then(function(response) {
        return response.text();
      })
      .then(text => {
        this.setState({ username: text });
      });
  };

  //gets userteam of player
  getUserteam = () => {
    fetch("http://localhost:8080/userteamget", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    })
      .then(function(response) {
        return response.text();
      })
      .then(text => {
        this.setState({ userteam: JSON.parse(text) });
      });
  };

  //gets the week of the season
  getWeek = () => {
    fetch("http://localhost:8080/weekget", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    })
      .then(function(response) {
        return response.text();
      })
      .then(text => {
        this.setState({ week: text });
      });
  };

  //get all teams data
  getTeams = () => {
    fetch("http://localhost:8080/teamsget", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    })
      .then(function(response) {
        return response.text();
      })
      .then(text => {
        let set = JSON.parse(text);
        let seasonTeams = [
          set.alaskaSeason,
          set.americaSeason,
          set.boondockSeason,
          set.floridaSeason,
          set.smashvilleSeason,
          set.southsideSeason
        ];
        this.setState({ teamsStats: seasonTeams });
      });
  };

  //runs functions that calculate winner, returns data of results and sets redirect
  getResults = () => {
    let scheduler = { schedule };
    let scheduleWeek = this.state.week % 10;
    let weeklyLineup = JSON.parse(scheduler.schedule[scheduleWeek].lineup);
    let game1 = { t1: weeklyLineup[0], t2: weeklyLineup[1] };
    let game2 = { t1: weeklyLineup[2], t2: weeklyLineup[3] };
    let game3 = { t1: weeklyLineup[4], t2: weeklyLineup[5] };
    let result1 = this.calculateCaps(game1);
    let result2 = this.calculateCaps(game2);
    let result3 = this.calculateCaps(game3);
    this.setState({
      game1: [
        result1.winner + " " + result1.winscore + " WIN! - ",
        result1.loser + " " + result1.losescore + " LOSE! " + result1.overtime
      ],
      game2: [
        result2.winner + " " + result2.winscore + " WIN! - ",
        result2.loser + " " + result2.losescore + " LOSE! " + result2.overtime
      ],
      game3: [
        result3.winner + " " + result3.winscore + " WIN! - ",
        result3.loser + " " + result3.losescore + " LOSE! " + result3.overtime
      ]
    });
    this.setState({
      calcredirect: true
    });
  };

  //calculates and returns winners and scores
  calculateCaps = game => {
    let randOT = 0;
    let isOT = "";
    let teams = this.state.teamsStats;
    let home = teams[game.t1 - 1];
    let away = teams[game.t2 - 1];
    let gameTeams = { home: home, away: away };
    let winner = this.calculateWinner(gameTeams);
    let score = this.calculateScore();
    if (score.winScore - score.loseScore === 1) {
      randOT = Math.floor(Math.random() * 4 + 1);
    }
    let sendResult = {
      team: "",
      wingoals: score.winScore,
      losegoals: score.loseScore
    };
    if (winner === "home") {
      sendResult.team = home.team;
      this.setWinner(sendResult);
      sendResult.team = away.team;
      if (randOT === 3) {
        isOT = "OT";
        this.setOvertime(sendResult);
      } else {
        this.setLoser(sendResult);
      }
      return {
        home: home.team,
        away: away.team,
        winner: home.team,
        loser: away.team,
        winscore: score.winScore,
        losescore: score.loseScore,
        overtime: isOT
      };
    } else {
      sendResult.team = away.team;
      this.setWinner(sendResult);
      sendResult.team = home.team;
      if (randOT === 3) {
        isOT = "OT";
        this.setOvertime(sendResult);
      } else {
        this.setLoser(sendResult);
      }
      return {
        home: home.team,
        away: away.team,
        winner: away.team,
        loser: home.team,
        winscore: score.winScore,
        losescore: score.loseScore,
        overtime: isOT
      };
    }
  };

  //calculate the winner of the game
  calculateWinner = gameTeams => {
    let winner;
    let playerList = { playerlist };
    let players = playerList.playerlist;
    let hg, hf, hd, ag, af, ad, totalChance;
    let homeChance = 1;
    let awayChance = 1;
    for (let i = 0; i < players.length; i++) {
      if (gameTeams.home.forward === players[i].name) {
        hf = players[i];
      } else if (gameTeams.away.forward === players[i].name) {
        af = players[i];
      } else if (gameTeams.home.goalie === players[i].name) {
        hg = players[i];
      } else if (gameTeams.away.goalie === players[i].name) {
        ag = players[i];
      } else if (gameTeams.home.dforward === players[i].name) {
        hd = players[i];
      } else if (gameTeams.away.dforward === players[i].name) {
        ad = players[i];
      }
    }

    //determine if forward caps are better than goalie caps of opposing team
    if (hf.forward >= ag.goalie) {
      homeChance = homeChance + 15;
    } else {
      awayChance = awayChance + 15;
    }
    if (hd.forward >= ag.goalie) {
      homeChance = homeChance + 10;
    } else {
      awayChance = awayChance + 10;
    }
    if (hg.goalie >= af.forward) {
      homeChance = homeChance + 15;
    } else {
      awayChance = awayChance + 15;
    }
    if (hg.goalie >= ad.forward) {
      homeChance = homeChance + 10;
    } else {
      awayChance = awayChance + 10;
    }

    //determine if shooting, defense, and strength are better for each forward
    if (hf.shooting >= af.shooting) {
      homeChance = homeChance + 10;
    } else {
      awayChance = awayChance + 10;
    }
    if (hd.defense >= ad.defense) {
      homeChance = homeChance + 10;
    } else {
      awayChance = awayChance + 10;
    }
    if (hf.strength >= af.strength) {
      homeChance = homeChance + 4;
    } else {
      awayChance = awayChance + 4;
    }
    if (hd.strength >= ad.strength) {
      homeChance = homeChance + 4;
    } else {
      awayChance = awayChance + 4;
    }

    //determine if size is better for each goalie
    if (hg.size >= ag.size) {
      homeChance = homeChance + 20;
    } else {
      awayChance = awayChance + 20;
    }

    //randomize winner based on chances
    totalChance = homeChance + awayChance;
    console.log(homeChance + " - " + gameTeams.home.team);
    console.log(awayChance + " - " + gameTeams.away.team);
    let winNum = Math.floor(Math.random() * totalChance + 1);
    console.log(winNum);
    if (winNum <= homeChance) {
      winner = "home";
    } else {
      winner = "away";
    }
    return winner;
  };

  //calculates the score of the game
  calculateScore = () => {
    let winScore = Math.floor(Math.random() * 7 + 1);
    if (winScore === 7) {
      let randomAdd = Math.floor(Math.random() * 10 + 1);
      if (randomAdd === 10) {
        winScore = 10;
      } else if (randomAdd === 9) {
        winScore = 9;
      } else if (randomAdd === 8) {
        winScore = 8;
      }
    }
    let loseScore = Math.floor(Math.random() * winScore);
    return { winScore: winScore, loseScore: loseScore };
  };

  //increments record of winning teams
  setWinner = winner => {
    let userdata = {
      result: winner,
      status: "win"
    };
    let stringdata = JSON.stringify(userdata);
    fetch("http://localhost:8080/setrecord", {
      method: "POST",
      body: stringdata,
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    }).then(() => {
      console.log("Worked");
    });
  };

  //increments record of losing teams
  setLoser = loser => {
    let userdata = {
      result: loser,
      status: "lose"
    };
    let stringdata = JSON.stringify(userdata);
    fetch("http://localhost:8080/setrecord", {
      method: "POST",
      body: stringdata,
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    }).then(() => {
      console.log("Worked");
    });
  };

  //increments record of losing teams
  setOvertime = overtimer => {
    let userdata = {
      result: overtimer,
      status: "overtime"
    };
    let stringdata = JSON.stringify(userdata);
    fetch("http://localhost:8080/setrecord", {
      method: "POST",
      body: stringdata,
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    }).then(() => {
      console.log("Worked");
    });
  };

  //runs methods that calculate results
  //exists for the purpose of paralleling setRedirect
  setCalculate = () => {
    this.getResults();
  };

  //redirects page to results of game
  calcRedirect = event => {
    if (this.state.calcredirect) {
      return (
        <Redirect
          to={{
            pathname: "/results",
            state: {
              username: this.state.username,
              userteam: this.state.userteam,
              teamsStats: this.state.teamsStats,
              game1: this.state.game1,
              game2: this.state.game2,
              game3: this.state.game3
            }
          }}
        />
      );
    }
  };

  //sets state so that page can redirct
  setStandings = () => {
    this.setState({
      standingredirect: true
    });
  };

  //redirects page to standings
  standRedirect = event => {
    if (this.state.standingredirect) {
      return (
        <Redirect
          to={{
            pathname: "/standings",
            state: {
              username: this.state.username,
              userteam: this.state.userteam,
              teamsStats: this.state.teamsStats
            }
          }}
        />
      );
    }
  };

  //sets state so that page can redirct
  setRedirect = () => {
    this.setState({
      redirect: true
    });
  };

  //redirects page to logout
  renderRedirect = event => {
    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: "/franchiselogout",
            state: {
              username: this.state.username,
              userteam: this.state.userteam
            }
          }}
        />
      );
    }
  };

  //display franchise screen
  render() {
    return (
      <React.Fragment>
        {this.renderRedirect()}
        {this.calcRedirect()}
        {this.standRedirect()}
        <h1>Franchise Menu</h1>
        <p>
          Coach {this.state.username} of the {this.state.userteam}
        </p>
        <p>Week: {this.state.week}</p>
        <button type="button" onClick={this.setCalculate}>
          Play Game
        </button>
        <br />
        <br />
        <button type="button" onClick={this.setStandings}>
          Standings
        </button>
        <br />
        <br />
        <button type="button" onClick={this.setRedirect}>
          Log Out
        </button>
        <br />
      </React.Fragment>
    );
  }
}

export default Franchise;
