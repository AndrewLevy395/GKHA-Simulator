import React from "react";

class Results extends React.Component {
  state = {
    username: "",
    week: "",
    teamsStats: [],
    game1: [],
    game2: [],
    game3: []
  };

  componentDidMount() {
    this.getUsername();
    this.getWeek();
    this.setStateValues();
  }

  setStateValues = () => {
    this.setState({
      teamStats: this.props.location.state.teamStats,
      game1: this.props.location.state.game1,
      game2: this.props.location.state.game2,
      game3: this.props.location.state.game3
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

  render() {
    return (
      <React.Fragment>
        <h1>Results</h1>
        <p>username: {this.state.username}</p>
        <p>result1: {this.state.game1}</p>
        <p>result2: {this.state.game2}</p>
        <p>result3: {this.state.game3}</p>
      </React.Fragment>
    );
  }
}

export default Results;
