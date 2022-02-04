//api/tags.js
const express = require("express");
const tagsRouter = express.Router();

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next();
});

const { getAllTags, getPostsByTagName } = require("../db");

tagsRouter.get("/", async (req, res) => {
  const tags = await getAllTags();

  res.send({
    tags,
  });
});

tagsRouter.get("/:tagName/posts", async (req, res, next) => {
  // read the tagname from the params
  const { tagName } = req.params;
  try {
    // use our method to get posts by tag name from the db
    const postsByTagName = await getPostsByTagName(tagName);
    // send out an object to client {posts://the posts}
    res.send({ posts: postsByTagName });
  } catch ({ name, message }) {
    // forward the name and message to the error handler
    next({ name: "TagNameError", message: "Failed to get posts by tag name" });
  }
});

module.exports = tagsRouter;
