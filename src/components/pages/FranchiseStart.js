import React from "react";
import { Redirect } from "react-router-dom";

class FranchiseStart extends React.Component {
  state = {
    redirect: false,
    username: this.props.location.state.username,
    userteam: this.props.location.state.userteam
  };

  //runs on page open
  componentDidMount() {
    this.setState({
      redirect: false
    });
  }

  //sets username
  setUsername = () => {
    let userdata = {
      username: this.state.username
    };
    let stringdata = JSON.stringify(userdata);
    try {
      fetch("http://localhost:8080/usernameset", {
        method: "POST",
        body: stringdata,
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      }).then(() => this.setState({ redirect: true }));
    } catch (err) {
      console.error("err.message:", err.message);
    }
  };

  //runs set username
  //exists to parallel setRedirect
  setUsernameRedirect = () => {
    this.setUsername();
  };

  //sets state to allow redirect
  setRedirect = () => {
    this.setState({
      redirect: true
    });
  };

  //redirects page to franchise menu
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
        {this.renderRedirect()}
        <h1>Start</h1>
        <button type="button" onClick={this.setUsernameRedirect}>
          Go!
        </button>
      </React.Fragment>
    );
  }
}

export default FranchiseStart;
