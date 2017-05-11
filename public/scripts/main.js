import React from "react";
import ReactDOM from "react-dom";
import AppComponent from "./react/appclass";

// Front end rendering and logic
// Use React and jQuery
// Globals:

var username = myUser;
var accessTokenFromServer = token;

// Render app
ReactDOM.render(<AppComponent username={username} servertoken={accessTokenFromServer} myPoll={myPoll}/>, document.getElementById('votingApp'));
