import React from "react";
import { Redirect } from "react-router-dom";

class Results extends React.Component {
  state = {
    username: "",
    week: "",
    teamsStats: [],
    game1: [],
    game2: [],
    game3: [],
    redirect: false
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
      game3: this.props.location.state.game3,
      rdirect: false
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

  incrementWeek = () => {
    fetch("http://localhost:8080/incrementweek", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    }).then(() => {
      this.setState({
        redirect: true
      });
    });
  };

  setRedirect = () => {
    this.incrementWeek();
  };

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
        <h1>Results</h1>
        {this.renderRedirect()}
        <p>username: {this.state.username}</p>
        <p>{this.state.game1}</p>
        <p>{this.state.game2}</p>
        <p>{this.state.game3}</p>
        <button type="button" onClick={this.setRedirect}>
          Next Week
        </button>
      </React.Fragment>
    );
  }
}

export default Results;
