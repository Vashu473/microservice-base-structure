const express = require("express");
const app = express();
const port = 4000;
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const axios = require("axios");
app.use(bodyParser.json());

let post = {};

app.get("/post", (req, res) => res.send(post));
app.post("/post", async (req, res) => {
  try {
    const { title } = req.body;
    let id = randomBytes(4).toString("hex");
    post[id] = {
      id,
      title,
    };
    await axios({
      method: "post",
      url: "http://event-bus:4005/events",
      // url: "http://localhost:4005/events",
      data: {
        type: "postCreated",
        data: {
          id,
          title,
        },
      },
    });
    return res.status(201).send(post[id]);
  } catch (error) {
    return res.send(error.message);
  }
});

app.post("/events", (req, res) => {
  try {
    console.log("post", req.body.type);
    return res.status(201).send({});
  } catch (error) {
    return res.send(error.message);
  }
});

app.listen(port, () => console.log(`Post running.... ${port}!`));
