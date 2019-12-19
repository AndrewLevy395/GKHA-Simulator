import React from "react";
import { Link } from "react-router-dom";

function Menu() {
  return (
    <React.Fragment>
      <h1>Main Menu</h1>
      <Link to="/franchisenew">New Franchise</Link>
      <br />
      <Link to="/franchiselogin">Load Franchise</Link>
      <br />
      <Link to="/">Exit</Link>
    </React.Fragment>
  );
}

export default Menu;
