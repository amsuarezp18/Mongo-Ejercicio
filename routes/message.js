var express = require('express');
var router = express.Router();
var [ getMessages, getMessage, postMessage, putMessage, deleteMessage] = require("../public/controllers/messages");
var messageLogic = require("../public/logic/messageLogic");
const ws = require("../wslib");

/* GET product listing. */
router.get("/api/messages", async function (req, res, next) {
    const messages = await getMessages();
    res.send(messages);
});

/* POST a message. */
router.post("/api/messages", async function (req, res, next) {
    req.body["ts"] = new Date().getTime();
    const newMessage = await postMessage(req.body);
    ws.sendMessages();
    res.send(newMessage.ops[0]);
});
  
/* GET message with especific ts. */
router.get("/api/messages/:ts", async function (req, res, next) {
  const message = await getMessage(req.params.ts);
  if (message === null) {
    return res.status(404).send("The message you are trying to reach does not exist.");
  } else return res.send(message);
});

/* PUT a message with especific ts. */
router.put("/api/messages", async function (req, res, next) {
  const message = await getMessage(req.body.ts);
  if (message === null) {
    return res.status(404).send("The message you are trying to update doesn not exist.");
  } else {
    req.body.message +=  req.body.ts;
    oldTs = req.body.ts;
    req.body.ts = new Date().getTime();
    updated = await putMessage(req.body, oldTs);
    ws.sendMessages();
    return res.send(req.body);
  }
});

/* DELETE a message with especific ts. */
router.delete("/api/messages/:ts", async function (req, res, next) {
  const message = await getMessage(req.params.ts);
  if (message === null) {
    return res.status(404).send("The message you are trying to delete does not exist.");
  } else {
    removed = await deleteMessage(req.params.ts);
    ws.sendMessages();
    return res.send(message);
  }
});

module.exports = router;