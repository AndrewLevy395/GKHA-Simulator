import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import Menu from "./components/pages/Menu";
import Header from "./components/layouts/Header";
import "./App.css";
import FranchiseNew from "./components/pages/FranchiseNew";
import FranchiseLogIn from "./components/pages/FranchiseLogIn";
import Franchise from "./components/pages/Franchise";
import FranchiseStart from "./components/pages/FranchiseStart";
import Results from "./components/pages/Results";
import FranchiseLogOut from "./components/pages/FranchiseLogOut";

class App extends Component {
  render() {
    return (
      <Router>
        <Header />
        <div className="App">
          <Route
            exact
            path="/"
            render={props => (
              <React.Fragment>
                <Link to="/menu">Start</Link>
              </React.Fragment>
            )}
          />
          <Route path="/menu" component={Menu} />
          <Route path="/franchisenew" component={FranchiseNew} />
          <Route path="/franchiselogin" component={FranchiseLogIn} />
          <Route path="/franchisestart" component={FranchiseStart} />
          <Route path="/franchise" component={Franchise} />
          <Route path="/results" component={Results} />
          <Route path="/franchiselogout" component={FranchiseLogOut} />
          <Route path="/app" component={App} />
        </div>
      </Router>
    );
  }
}

export default App;
