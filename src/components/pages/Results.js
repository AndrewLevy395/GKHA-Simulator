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
      redirect: false
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
      game3: this.props.location.state.game3
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
