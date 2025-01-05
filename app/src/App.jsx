import React from "react";
import { Conference } from "./pages/conference/Conference";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { Header } from "./Header";
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from "@apollo/client"
import "./App.css";

// Initialize Apollo Client
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "http://localhost:4000/graphql" // your graphql server link
  }),
  credentials: "same-origin",
})


function AppRouter() {
  return (
    <div id="wrapper">
      <Router>
        <Header />
          <Switch>
            <Route path="/conference">
              <Conference />
            </Route>
            <Route path="/">
              <Conference />
            </Route>
          </Switch>
      </Router>
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client = {client}>
      <AppRouter />
    </ApolloProvider>
  );
}

export default App;
