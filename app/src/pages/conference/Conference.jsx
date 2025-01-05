import * as React from "react";
import { Switch, Route, Link, useRouteMatch } from "react-router-dom";
import { Sessions, AddSession } from "./Sessions"
import { Speakers, SpeakerDetailsPage } from "./Speakers"

export function Conference() {
  const { path, url } = useRouteMatch();

  return (
    <>
      <Switch>
        <Route path={`${path}/sessions/new`}>	
          <AddSession />	
        </Route>
        <Route path={`${path}/sessions`}>
          <Sessions />
        </Route>
        <Route path={`${path}/speakers`}>
          <Speakers />
        </Route>
        <Route path={`${path}/speaker/:speaker_id`}>
          <SpeakerDetailsPage />
        </Route>
        <Route path={`${path}`}>
          <section className="banner">
            <img src="./images/banner1.png" alt="" />
            <div className="inner-content col-md-12">
              <div className="container jumboContainer">
                <div className="col-md-4 middle">
                  <HeroLinkButton to={`${url}/speakers`}>
                    View Speakers
                  </HeroLinkButton>
                  <HeroLinkButton to={`${url}/sessions`}>
                    View Sessions
                  </HeroLinkButton>
                <div className="conference-element about">
                  <h2>About</h2>
                  <p><i>
                    I'm Andrey Karpovich (aka Flying Carp), web-developer, and this is my demo app. All data is stored
                      using the Apollo-server, reading and updating handled with GraphQL requests, and frontend
                      is implemented on React (bootstrap based layouts). One can also play with db-request in
                      generated playground (http://localhost:4000/graphql by default). All stuff is completely random,
                      partially AI-generated.
                      <br/> First published: jan 2025.
                  </i></p>
                </div>
                </div>
              </div>
            </div>
          </section>
        </Route>
      </Switch>
    </>
  );
}

function HeroLinkButton({ children, to }) {
  return (
    <h1>
      <Link
      className="conference-element"
        style={{
          display: "flex",
          justifyContent: "center",
        }}
        to={to}
      >
        {children}
      </Link>
    </h1>
  );
}
