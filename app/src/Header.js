import React from "react";
import logo from "./images/flying_carp.png";
import { Link } from "react-router-dom";

function NavLinks() {
  return (
    <ul className="navbar-nav mr-auto">
      <li className="nav-item">
        <Link className="nav-link" to="/conference">
          Conference
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/conference/sessions">
          Sessions
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/conference/speakers">
          Speakers
        </Link>
      </li>
    </ul>
  );
}

export function Header() {
  return (
    <header>
      <div className="container" style={{padding: '0 5%'}}>
        <div className="logo col-md-5 col-sm-5 col-xs-8">
          <Link to="/conference">
            <img src={logo} alt="logo" />
          </Link>
          <span className="text">APOLLO + GRAPHQL + REACT DEMO</span>
        </div>
        {/* <div className="mobile-togle col-md-12 col-sm-12 col-xs-12">
          <nav className="navbar navbar-default" role="navigation">
           
            <div className="collapse navbar-collapse" id="navbar-collapse-x">
              <ul className="nav navbar-nav navbar-right">               
                <NavLinks />
              </ul>
            </div>
          </nav>
        </div> */}

        <div className="right_section col-md-5 col-xs-12">       
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <NavLinks />
            </div>
          </nav>
        </div>       
      </div>
    </header>
  );
}
