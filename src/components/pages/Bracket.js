import React from "react";
import { Redirect } from "react-router-dom";

class Bracket extends React.Component {
  state = {
    playoffTeams: [{ team: "" }, { team: "" }, { team: "" }, { team: "" }],
    username: "",
    userteam: "",
    showTeams: false,
    redirect: false
  };

  componentDidMount() {
    this.setStateValues();
    console.log(this.state.playoffTeams[0].team);
  }

  //sets state based on results calculated in franchise.js
  setStateValues = () => {
    fetch("http://localhost:8080/playoffteamsget", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    })
      .then(function(response) {
        return response.text();
      })
      .then(text => {
        let set = JSON.parse(text);
        console.log(set);
        this.setState({
          playoffTeams: set,
          userteam: this.props.location.state.userteam,
          username: this.props.location.state.username,
          showTeams: true
        });
      });
  };

  //sets state so that page can redirct
  setRedirect = () => {
    this.setState({
      redirect: true
    });
  };

  //redirects page back
  backRedirect = event => {
    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: "/franchise",
            state: {
              username: this.state.username,
              userteam: this.state.userteam
            }
          }}
        />
      );
    }
  };

  //displays playoff button
  displayPlayoff = event => {
    if (this.state.showTeams === true) {
      console.log(this.state.playoffTeams[0].team);
      return (
        <div>
          <p>
            1. {this.state.playoffTeams[0].team} - (
            {this.state.playoffTeams[0].wins}-
            {this.state.playoffTeams[0].losses}-
            {this.state.playoffTeams[0].overtime})
          </p>
          <p>
            4. {this.state.playoffTeams[3].team} - (
            {this.state.playoffTeams[3].wins}-
            {this.state.playoffTeams[3].losses}-
            {this.state.playoffTeams[3].overtime})
          </p>
          <br />
          <br />
          <p>
            2. {this.state.playoffTeams[1].team} - (
            {this.state.playoffTeams[1].wins}-
            {this.state.playoffTeams[1].losses}-
            {this.state.playoffTeams[1].overtime})
          </p>
          <p>
            3. {this.state.playoffTeams[2].team} - (
            {this.state.playoffTeams[2].wins}-
            {this.state.playoffTeams[2].losses}-
            {this.state.playoffTeams[2].overtime})
          </p>
        </div>
      );
    }
  };

  render() {
    return (
      <React.Fragment>
        {this.backRedirect()}
        <h1>Bracket</h1>
        <br />
        {this.displayPlayoff()}
        <br />
        <br />
        <button type="button" onClick={this.setRedirect}>
          Back
        </button>
      </React.Fragment>
    );
  }
}

export default Bracket;
