const express = require("express");
const app = express();
const port = 4005;
app.use(express.json());
const axios = require("axios");
let events = [];

app.get("/events", (req, res) => res.send(events));

app.post("/events", (req, res) => {
  try {
    events.push(req.body);
    axios({
      method: "post",
      url: "http://post-cluster-ip:4000/events",
      // url: "http://localhost:4000/events",
      data: req.body,
    });
    console.log("api done");
    // axios({
    //   method: "post",
    //   url: "http://localhost:4001/events",
    //   data: req.body,
    // });
    // axios({
    //   method: "post",
    //   url: "http://localhost:4002/events",
    //   data: req.body,
    // });
    // axios({
    //   method: "post",
    //   url: "http://localhost:4003/events",
    //   data: req.body,
    // });
    return res.send("OKay");
  } catch (error) {
    return res.send(error.message);
  }
});
app.listen(port, () => {
  console.log("Event bus running", port);
});
