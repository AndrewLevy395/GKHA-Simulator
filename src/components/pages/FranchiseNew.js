import React from "react";
import teamlist from "../data/teamlist";
import playerlist from "../data/playerlist";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";

class FranchiseNew extends React.Component {
  state = {
    redirect: false,
    franchisegot: false,
    username: "",
    userteam: "Alaskan Thunder",
    teams: teamlist,
    teamInt: 0,
    teamCaps: [5, 5, 7, 4, 5, 5]
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

  //sets the caps being looked at in selection
  setCapsinList = () => {
    let ofCap, ogCap, dfCap, dgCap, gfCap, ggCap;
    for (let i = 0; i < playerlist.length; i++) {
      if (this.state.teams[this.state.teamInt].forward === playerlist[i].name) {
        ofCap = playerlist[i].forward;
        ogCap = playerlist[i].goalie;
      }
      if (
        this.state.teams[this.state.teamInt].dforward === playerlist[i].name
      ) {
        dfCap = playerlist[i].forward;
        dgCap = playerlist[i].goalie;
      }
      if (this.state.teams[this.state.teamInt].goalie === playerlist[i].name) {
        gfCap = playerlist[i].forward;
        ggCap = playerlist[i].goalie;
      }
    }
    this.setState({ teamCaps: [ofCap, ogCap, dfCap, dgCap, gfCap, ggCap] });
  };

  //sets the team being looked at in selection
  setTeaminList = () => {
    for (let i = 0; i < teamlist.length; i++) {
      if (this.state.userteam === teamlist[i].team) {
        this.setState({ teamInt: i }, function() {
          this.setCapsinList();
        });
      }
    }
  };

  //shows name as it is updated live
  myChangeHandler = event => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({ [name]: value }, function() {
      this.setTeaminList();
    });
  };

  render() {
    return (
      <React.Fragment>
        <h1>Franchise</h1>
        {this.renderRedirect()}
        <form>
          <p>
            Coach {this.state.username} of the {this.state.userteam}
          </p>
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
        <br />{" "}
        <table>
          <tbody>
            <tr>
              <th>Position</th>
              <th> Player </th>
              <th> Forward Cap </th>
              <th> Goalie Cap </th>
            </tr>
            <tr>
              <th>-</th>
              <th>-</th>
              <th>-</th>
              <th>-</th>
            </tr>
            <tr>
              <th> Offense: </th>
              <th> {this.state.teams[this.state.teamInt].forward} </th>
              <th>{this.state.teamCaps[0]}</th>
              <th>{this.state.teamCaps[1]} </th>
            </tr>
            <tr>
              <th> Defense: </th>
              <th>{this.state.teams[this.state.teamInt].dforward}</th>
              <th>{this.state.teamCaps[2]}</th>
              <th>{this.state.teamCaps[3]} </th>
            </tr>
            <tr>
              <th>Goalie:</th>
              <th>{this.state.teams[this.state.teamInt].goalie}</th>
              <th>{this.state.teamCaps[4]}</th>
              <th>{this.state.teamCaps[5]} </th>
            </tr>
          </tbody>
        </table>
        <br />
        <Link to="/menu">Menu</Link>
        <br />
      </React.Fragment>
    );
  }
}

export default FranchiseNew;
