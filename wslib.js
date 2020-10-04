
const { string } = require("joi");
const WebSocket = require("ws");
var [ getMessages, postMessage ] = require("./public/controllers/messages");
const clients = [];

const wsConnection = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);
    sendMessages();

    ws.on("message", async function (message) {
      message = JSON.parse(message);
      message["ts"] = new Date().getTime();
      let x = await postMessage(message);
      sendMessages();
    });
  });
};

const sendMessages = () => {
  clients.forEach((client) => {
    getMessages().then((result) => {
      messages = JSON.stringify(result);
      client.send(messages);
    });
  });
};

exports.wsConnection = wsConnection;
exports.sendMessages = sendMessages;
