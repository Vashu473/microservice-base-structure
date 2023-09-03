const express = require("express");
const app = express();
const port = 4003;
const axios = require("axios");
app.use(express.json());
app.post("/events", async (req, res) => {
  try {
    const { type, data } = req.body;
    if (type == "commentCreated") {
      let status = data.content.includes("abc") ? "rejected" : "approved";
      await axios({
        method: "post",
        url: "http://localhost:4005/events",
        data: {
          type: "commentModerated",
          data: {
            ...data,
            status,
          },
        },
      });
    }
    res.send("Okay");
  } catch (error) {
    res.send(error.message);
  }
});
app.listen(port, () => console.log(`app listening on port ${port}!`));
