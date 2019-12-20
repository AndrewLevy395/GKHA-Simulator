import React from "react";
import { Redirect } from "react-router-dom";

class Standings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      userteam: "",
      teamsStats: [
        { name: "", wins: "", losses: "" },
        { name: "", wins: "", losses: "" },
        { name: "", wins: "", losses: "" },
        { name: "", wins: "", losses: "" },
        { name: "", wins: "", losses: "" },
        { name: "", wins: "", losses: "" }
      ],
      redirect: false
    };
  }

  //run on page open
  componentDidMount() {
    this.setStateValues();
  }

  //sets state based on results calculated in franchise.js
  setStateValues = () => {
    this.setState(
      {
        teamsStats: this.props.location.state.teamsStats,
        username: this.props.location.state.username,
        userteam: this.props.location.state.userteam
      },
      function() {
        this.rankTeams();
      }
    );
  };

  //rank teams from best to worst
  rankTeams = () => {
    let teams = this.state.teamsStats;
    teams.sort(function(a, b) {
      return b.wins - a.wins;
    });
    this.setState({ teamsStats: teams });
  };

  //runs increment week and sets state to allow redirect
  setRedirect = () => {
    this.setState({
      redirect: true
    });
  };

  //redirects to franchise menu
  renderRedirect = event => {
    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: "/franchise"
          }}
        />
      );
    }
  };

  render() {
    return (
      <React.Fragment>
        <p>username: {this.state.username}</p>
        <h1>Standings</h1>
        {this.renderRedirect()}
        <table>
          <tbody>
            <tr>
              <th>Current Seed</th>
              <th>Team</th>
              <th>Wins</th>
              <th>Losses</th>
            </tr>
            <tr>
              <th>1</th>
              <th>{this.state.teamsStats[0].team}</th>
              <th>{this.state.teamsStats[0].wins}</th>
              <th>{this.state.teamsStats[0].losses}</th>
            </tr>
            <tr>
              <th>2</th>
              <th>{this.state.teamsStats[1].team}</th>
              <th>{this.state.teamsStats[1].wins}</th>
              <th>{this.state.teamsStats[1].losses}</th>
            </tr>
            <tr>
              <th>3</th>
              <th>{this.state.teamsStats[2].team}</th>
              <th>{this.state.teamsStats[2].wins}</th>
              <th>{this.state.teamsStats[2].losses}</th>
            </tr>
            <tr>
              <th>4</th>
              <th>{this.state.teamsStats[3].team}</th>
              <th>{this.state.teamsStats[3].wins}</th>
              <th>{this.state.teamsStats[3].losses}</th>
            </tr>
            <tr>
              <th></th>
              <th>{this.state.teamsStats[4].team}</th>
              <th>{this.state.teamsStats[4].wins}</th>
              <th>{this.state.teamsStats[4].losses}</th>
            </tr>
            <tr>
              <th></th>
              <th>{this.state.teamsStats[5].team}</th>
              <th>{this.state.teamsStats[5].wins}</th>
              <th>{this.state.teamsStats[5].losses}</th>
            </tr>
          </tbody>
        </table>
        <br />
        <button type="button" onClick={this.setRedirect}>
          Back
        </button>
      </React.Fragment>
    );
  }
}

export default Standings;
