const express = require("express");
const app = express();
const port = 4002;
app.use(express.json());
const axios = require("axios");
let posts = {};
const handleEvent = (type, data) => {
  if (type == "postCreated") {
    posts[data.id] = {
      ...data,
      comment: [],
    };
  } else if (type == "commentCreated") {
    let post = posts[data.postId];
    post.comment.push({ id: data.id, content: data.content });
  } else if (type == "commentUpdated") {
    const { id, content, postId, status } = data;
    let post = posts[postId];
    let comment = post.comment.find((data) => data.id == id);
    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", (req, res) => res.send(posts));

app.post("/events", (req, res) => {
  try {
    const { type, data } = req.body;
    handleEvent(type, data);
    res.send("data sent");
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
});
app.listen(port, async () => {
  console.log(`app listening on port ${port}!`);
  const res = await axios("http://localhost:4005/events");
  for (const event of res.data) {
    handleEvent(event.type, event.data);
  }
});
