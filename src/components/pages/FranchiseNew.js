import React from "react";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";

class FranchiseNew extends React.Component {
  state = {
    redirect: false,
    franchisegot: false,
    username: "",
    userteam: "Alaskan Thunder"
  };

  //creates franchise
  createFranchise = () => {
    let userdata = {
      username: this.state.username,
      userteam: this.state.userteam
    };
    let stringdata = JSON.stringify(userdata);
    fetch("http://localhost:8080/addfranchise", {
      method: "POST",
      body: stringdata,
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    });
  };

  //sets state to allow redirect
  setRedirect = () => {
    this.setState({
      redirect: true
    });
  };

  //redirects page to start of franchise
  renderRedirect = event => {
    if (this.state.redirect) {
      this.createFranchise();
      return (
        <Redirect
          to={{
            pathname: "/franchisestart",
            state: {
              username: this.state.username,
              userteam: this.state.userteam
            }
          }}
        />
      );
    }
  };

  //shows name as it is updated live
  myChangeHandler = event => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({ [name]: value });
  };

  render() {
    return (
      <React.Fragment>
        <h1>Franchise</h1>
        {this.renderRedirect()}
        <form>
          <p>Coach {this.state.username}</p>
          <input
            required
            type="text"
            placeholder="Username"
            name="username"
            onChange={this.myChangeHandler}
          ></input>
          <br />
          <select required name="userteam" onChange={this.myChangeHandler}>
            <option value="Alaskan Thunder">Alaskan Thunder</option>
            <option value="American Revolution">American Revolution</option>
            <option value="Boondock Beluga Whales">
              Boondock Beluga Whales
            </option>
            <option value="Florida Tropics">Florida Tropics</option>
            <option value="Smashville Chippewas">Smashville Chippewas</option>
            <option value="Southside Spartans">Southside Spartans</option>
          </select>
          <br />
          <button type="button" onClick={this.setRedirect}>
            Create
          </button>
        </form>
        <br />
        <Link to="/menu">Menu</Link>
      </React.Fragment>
    );
  }
}

export default FranchiseNew;
