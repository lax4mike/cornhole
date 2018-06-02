const WebSocket = require("ws");
const db = require("./db.js");

const { initialScores } = require("../client/js/types/scores.js");


module.exports = function createWebsocket(server){

  const wss = new WebSocket.Server({ server });

  // Broadcast to all.
  wss.broadcast = (data) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  };


  // set initial state
  db.setState(JSON.stringify(initialScores));


  wss.on("connection", (ws) => {

    // send initial state
    db.getState()
      .fork(
        console.error,
        (data) => ws.send(data)
      );


    ws.on("error", (err) => {
      console.error(err);
    });


    ws.on("message", json => {

      // record the score
      db.setState(json);

      // send it to everyone
      wss.broadcast(json);

    });

  });
};
