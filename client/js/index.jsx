import React from "react";
import ReactDom from "react-dom";

import App from "./components/App.jsx";

// hostname so it works on localhost and mikelambert.me
const ws = new WebSocket(`ws://${window.location.hostname}:3030`);


const onScore = (scores) => {
  ws.send(JSON.stringify(scores));
};

ws.addEventListener("open", event => {

  // console.log(`Connected to: ${event.currentTarget.url}`);


  ws.addEventListener("message", event => {

    const { data } = event;
    const scores = JSON.parse(data);

    ReactDom.render(
      <App scores={scores} onScore={onScore} />,
      document.querySelector(".js-cornhole-mount")
    );

  });
});
