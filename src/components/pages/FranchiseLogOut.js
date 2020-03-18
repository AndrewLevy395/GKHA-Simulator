import React from "react";
import { Redirect } from "react-router-dom";

class FranchiseLogOut extends React.Component {
  constructor() {
    super();
    this.remUsername();
  }

  state = {
    redirect: false
  };

  //removes username
  remUsername = () => {
    let userdata = {
      username: ""
    };
    let stringdata = JSON.stringify(userdata);
    fetch("http://localhost:8080/usernamerem", {
      method: "POST",
      body: stringdata,
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    });
  };

  //changes state to allow redirect
  setRedirect = () => {
    this.setState({
      redirect: true
    });
  };

  //redirects page to menu and removes player's username
  renderRedirect = event => {
    this.remUsername();
    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: "/menu"
          }}
        />
      );
    }
  };

  render() {
    return (
      <React.Fragment>
        {this.renderRedirect()}
        <h1>Logged Out</h1>
        <button type="button" onClick={this.setRedirect}>
          Menu
        </button>
      </React.Fragment>
    );
  }
}

export default FranchiseLogOut;
