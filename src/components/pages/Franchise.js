import React from "react";
import schedule from "../data/schedule";
import teamlist from "../data/teamlist";
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
        let scheduleWeek = (this.state.week % 5) - 1;
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
    let teams = { teamlist };
    let players = { playerlist };
    let home = teams.teamlist[game.t1 - 1].name;
    let away = teams.teamlist[game.t2 - 1].name;
    let homeGoalie, homeForward, awayGoalie, awayForward;
    let hgCap, hfCap, agCap, afCap;
    for (let i = 0; i < this.state.teamsStats.length; i++) {
      if (this.state.teamsStats[i][0] === home) {
        homeGoalie = this.state.teamsStats[i][4];
        homeForward = this.state.teamsStats[i][3];
      }
      if (this.state.teamsStats[i][0] === away) {
        awayGoalie = this.state.teamsStats[i][4];
        awayForward = this.state.teamsStats[i][3];
      }
    }
    for (let i = 0; i < players.playerlist.length; i++) {
      if (players.playerlist[i].name === homeGoalie) {
        hgCap = players.playerlist[i].goalie;
      }
      if (players.playerlist[i].name === homeForward) {
        hfCap = players.playerlist[i].forward;
      }
      if (players.playerlist[i].name === awayGoalie) {
        agCap = players.playerlist[i].goalie;
      }
      if (players.playerlist[i].name === awayForward) {
        afCap = players.playerlist[i].forward;
      }
    }
    let caps = [hgCap, hfCap, agCap, afCap];
    let winner = this.calculateWinner(caps);
    let score = this.calculateScore();
    if (winner === "home") {
      this.setWinner(home);
      this.setLoser(away);
      return {
        winner: home,
        loser: away,
        winscore: score.winScore,
        losescore: score.loseScore
      };
    } else {
      this.setWinner(away);
      this.setLoser(home);
      return {
        winner: away,
        loser: home,
        winscore: score.winScore,
        losescore: score.loseScore
      };
    }
  };

  calculateWinner = caps => {
    let winner;
    let hometotal = caps[0] + caps[1];
    let awaytotal = caps[2] + caps[3];
    let total = hometotal + awaytotal;
    let winNum = Math.floor(Math.random() * total + 1);
    if (winNum <= hometotal) {
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
    console.log(winScore, loseScore);
    return { winScore: winScore, loseScore: loseScore };
  };

  setWinner = winner => {
    console.log(winner);
  };

  setLoser = loser => {
    console.log(loser);
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
              teamsStats: this.state.teamStats,
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
