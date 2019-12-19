import React from "react";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";

class FranchiseLogIn extends React.Component {
  state = {
    redirect: false,
    username: ""
  };

  componentDidMount() {
    this.setState({
      redirect: false
    });
  }

  checkFranchise = () => {
    let userdata = {
      username: this.state.username
    };
    let stringdata = JSON.stringify(userdata);
    fetch("http://localhost:8080/usernamecheck", {
      method: "POST",
      body: stringdata,
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    })
      .then(function(response) {
        return response.text();
      })
      .then(text => {
        this.loadFranchise(text);
      });
  };

  loadFranchise = result => {
    if (result !== "invalid") {
      let userdata = {
        username: this.state.username
      };
      let stringdata = JSON.stringify(userdata);
      fetch("http://localhost:8080/usernameset", {
        method: "POST",
        body: stringdata,
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      }).then(() => this.setState({ redirect: true }));
    } else {
      console.log("failed");
    }
  };

  setUsernameRedirect = () => {
    this.checkFranchise();
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

  setRedirect = () => {
    this.setState({
      redirect: true
    });
  };

  myChangeHandler = event => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({ [name]: value });
  };

  render() {
    return (
      <React.Fragment>
        <h1>Franchise Log In</h1>
        {this.renderRedirect()}
        <input
          required
          type="text"
          placeholder="Username"
          name="username"
          onChange={this.myChangeHandler}
        ></input>
        <button type="button" onClick={this.setUsernameRedirect}>
          Log In
        </button>
        <br />
        <Link to="/menu">Menu</Link>
      </React.Fragment>
    );
  }
}

export default FranchiseLogIn;
