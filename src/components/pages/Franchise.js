import React from "react";
import schedule from "../data/schedule";
import playerlist from "../data/playerlist";
import { Redirect } from "react-router-dom";

class Franchise extends React.Component {
  state = {
    username: "",
    week: "",
    redirect: false,
    calcredirect: false,
    teamsStats: [],
    game1: [],
    game2: [],
    game3: []
  };

  componentDidMount() {
    this.getWeek();
    this.getUsername();
  }

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
        let scheduler = { schedule };
        let scheduleWeek = this.state.week % 5;
        let weeklyLineup = JSON.parse(scheduler.schedule[scheduleWeek].lineup);
        this.setState({ teamsStats: seasonTeams });
        let game1 = { t1: weeklyLineup[0], t2: weeklyLineup[1] };
        let game2 = { t1: weeklyLineup[2], t2: weeklyLineup[3] };
        let game3 = { t1: weeklyLineup[4], t2: weeklyLineup[5] };
        let result1 = this.calculateCaps(game1);
        let result2 = this.calculateCaps(game2);
        let result3 = this.calculateCaps(game3);
        this.setState({
          game1: [
            result1.winner + " " + result1.winscore + " WIN! - ",
            result1.loser + " " + result1.losescore + " LOSE!"
          ],
          game2: [
            result2.winner + " " + result2.winscore + " WIN! - ",
            result2.loser + " " + result2.losescore + " LOSE!"
          ],
          game3: [
            result3.winner + " " + result3.winscore + " WIN! - ",
            result3.loser + " " + result3.losescore + " LOSE!"
          ]
        });
      })
      .then(() =>
        this.setState({
          calcredirect: true
        })
      );
  };

  calculateCaps = game => {
    let teams = this.state.teamsStats;

    let home = teams[game.t1 - 1];
    let away = teams[game.t2 - 1];

    let gameTeams = { home: home, away: away };

    let winner = this.calculateWinner(gameTeams);
    let score = this.calculateScore();
    if (winner === "home") {
      this.setWinner(home.team);
      this.setLoser(away.team);
      return {
        home: home.team,
        away: away.team,
        winner: home.team,
        loser: away.team,
        winscore: score.winScore,
        losescore: score.loseScore
      };
    } else {
      this.setWinner(away.team);
      this.setLoser(home.team);
      return {
        home: home.team,
        away: away.team,
        winner: away.team,
        loser: home.team,
        winscore: score.winScore,
        losescore: score.loseScore
      };
    }
  };

  calculateWinner = gameTeams => {
    let winner;
    let playerList = { playerlist };
    let players = playerList.playerlist;
    let hg, hf, ag, af, totalChance;
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
      }
    }

    //determine if forward caps are better than goalie caps of opposing team
    if (hf.forward >= ag.goalie) {
      homeChance = homeChance + 20;
    } else {
      awayChance = awayChance + 20;
    }
    if (hg.goalie >= af.forward) {
      homeChance = homeChance + 20;
    } else {
      awayChance = awayChance + 20;
    }

    //determine if shooting, defense, and strength are better for each forward
    if (hf.shooting >= af.shooting) {
      homeChance = homeChance + 10;
    } else {
      awayChance = awayChance + 10;
    }
    if (hf.defense >= af.defense) {
      homeChance = homeChance + 10;
    } else {
      awayChance = awayChance + 10;
    }
    if (hf.strength >= af.strength) {
      homeChance = homeChance + 10;
    } else {
      awayChance = awayChance + 10;
    }

    //determine if size and strength are better for each goalie
    if (hg.size >= ag.size) {
      homeChance = homeChance + 20;
    } else {
      awayChance = awayChance + 20;
    }
    if (hg.strength >= ag.strength) {
      homeChance = homeChance + 8;
    } else {
      awayChance = awayChance + 8;
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

  setWinner = winner => {
    let userdata = {
      team: winner,
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

  setLoser = loser => {
    let userdata = {
      team: loser,
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

  setCalculate = () => {
    this.getTeams();
  };

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

  setRedirect = () => {
    this.setState({
      redirect: true
    });
  };

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

  render() {
    return (
      <React.Fragment>
        {this.renderRedirect()}
        {this.calcRedirect()}
        <h1>Franchise Menu</h1>
        <p>{this.state.username}</p>
        <p>Week: {this.state.week}</p>
        <button type="button" onClick={this.setCalculate}>
          Play Game
        </button>
        <br />
        <br />
        <button type="button" onClick={this.setRedirect}>
          Log Out
        </button>
      </React.Fragment>
    );
  }
}

export default Franchise;
