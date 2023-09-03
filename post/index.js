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
      url: "http://localhost:4005/events",
      data: {
        type: "postCreated",
        data: {
          id,
          title,
        },
      },
    });
    res.status(201).send(post[id]);
  } catch (error) {
    return res.send(error.message);
  }
});

app.post("/events", (req, res) => {
  console.log(req.body.type);
  res.send({});
});

app.listen(port, () => console.log(`app listening on port ${port}!`));
