const express = require("express");
const app = express();
const port = 4001;
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const axios = require("axios");
app.use(bodyParser.json());

let commentsById = {};

app.get("/post/:id/comment", (req, res) =>
  res.send(commentsById[req.params.id] || [])
);
app.post("/post/:id/comment", async (req, res) => {
  const { content } = req.body;
  let id = randomBytes(4).toString("hex");
  let comments = commentsById[req.params.id] || [];
  comments.push({
    id,
    content,
    status: "pending",
  });
  commentsById[req.params.id] = comments;
  await axios({
    method: "post",
    url: "http://localhost:4005/events",
    data: {
      type: "commentCreated",
      data: {
        id,
        content,
        postId: req.params.id,
        status: "pending",
      },
    },
  });
  res.status(201).send(comments);
});
app.post("/events", async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type == "commentModerated") {
      const { id, content, postId, status } = data;
      let allComment = commentsById[postId];
      let comment = allComment.find((data) => data.id == id);
      comment.status = status;
      comment.content = content;
      await axios({
        method: "post",
        url: "http://localhost:4005/events",
        data: {
          type: "commentUpdated",
          data: {
            id,
            content,
            postId,
            status,
          },
        },
      });
    }
    res.send("Okay");
  } catch (error) {
    return res.send(error.message);
  }
});

app.listen(port, () => console.log(`app listening on port ${port}!`));
