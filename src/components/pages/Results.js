import React from "react";
import { Redirect } from "react-router-dom";

class Results extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      week: "",
      teamsStats: [],
      game1: [],
      game2: [],
      game3: [],
      stats1: {},
      stats2: {},
      stats3: {},
      redirect: false,
      results: false
    };
  }

  //run on page open
  componentDidMount() {
    this.getUsername();
    this.getWeek();
    this.setStateValues();
  }

  //sets state based on results calculated in franchise.js
  setStateValues = () => {
    this.setState({
      teamsStats: this.props.location.state.teamsStats,
      game1: this.props.location.state.game1,
      game2: this.props.location.state.game2,
      game3: this.props.location.state.game3,
      stats1: this.props.location.state.stats1,
      stats2: this.props.location.state.stats2,
      stats3: this.props.location.state.stats3,
      results: true
    });
  };

  //get the week
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

  //get the username
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

  //increment the week on click
  incrementWeek = () => {
    if (this.props.location.state.playoffs !== true) {
      fetch("http://localhost:8080/incrementweek", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      }).then(() => {
        this.setState({
          redirect: true
        });
      });
    } else {
      this.setState({
        redirect: true
      });
    }
  };

  //runs increment week and sets state to allow redirect
  setRedirect = () => {
    this.incrementWeek();
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

  //displays game results
  displayResults = event => {
    if (this.state.results === true) {
      return (
        <div>
          <b>
            {this.state.game1.winner} {this.state.game1.winscore} defeats{" "}
            {this.state.game1.loser} {this.state.game1.losescore}{" "}
            {this.state.game1.overtime}
          </b>
          <br />
          <br />
          <b>
            {this.state.game2.winner} {this.state.game2.winscore} defeats{" "}
            {this.state.game2.loser} {this.state.game2.losescore}{" "}
            {this.state.game2.overtime}
          </b>
          <br />
          <br />
          <b>
            {this.state.game3.winner} {this.state.game3.winscore} defeats{" "}
            {this.state.game3.loser} {this.state.game3.losescore}{" "}
            {this.state.game3.overtime}
          </b>
          <br />
          <br />
        </div>
      );
    }
  };

  // TO DO - CHANGE GAME1/2/3 TO FUNCTION THAT DISPLAYS ONLY WHEN LOADED
  render() {
    return (
      <React.Fragment>
        <h1>Results</h1>
        {this.renderRedirect()}
        <p>username: {this.state.username}</p>
        {this.displayResults()}
        <button type="button" onClick={this.setRedirect}>
          Next Week
        </button>
      </React.Fragment>
    );
  }
}

export default Results;
