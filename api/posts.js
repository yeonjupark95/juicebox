// api/posts.js
const express = require("express");
const postsRouter = express.Router();
const { requireUser } = require("./utils");
const { createPost, getPostById, updatePost } = require("../db");

postsRouter.post("/", requireUser, async (req, res, next) => {
  const { title, content, tags = "" } = req.body;
  const userId = req.user.id;
  const tagArr = tags.trim().split(/\s+/);
  const postData = {};

  // only send the tags if there are some to send
  if (tagArr.length) {
    postData.tags = tagArr;
  }

  try {
    // add authorId, title, content to postData object
    postData.authorId = userId;
    postData.title = title;
    postData.content = content;
    // const post = await createPost(postData);
    const post = await createPost(postData);
    // this will create the post and the tags for us
    // if the post comes back, res.send({ post });
    console.log(post);
    if (post) {
      res.send(post);
    } else {
      next({ name: "PostError", message: "Failed to create post" });
    }
    // otherwise, next an appropriate error object
  } catch ({ name, message }) {
    next({ name: "PostError", message: "Failed to create post" });
  }
});

postsRouter.patch("/:postId", requireUser, async (req, res, next) => {
  const { postId } = req.params;
  const { title, content, tags } = req.body;

  const updateFields = {};

  if (tags && tags.length > 0) {
    updateFields.title = title;
  }
  if (content) {
    updateFields.content = content;
  }

  try {
    const originalPost = await getPostById(postId);

    if (originalPost.author.id === req.user.id) {
      const updatePost = await updatePost(postId, updateFields);
      res.send({ post: updatedPost });
    } else {
      next({
        name: "UnauthorizedUserError",
        message: "You cannot updatea  post that is not yours",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.use((req, res, next) => {
  console.log("A request is being made to /posts");

  next();
});

const { getAllPosts } = require("../db");

postsRouter.get("/", async (req, res) => {
  const posts = await getAllPosts();

  res.send({
    posts,
  });
});

module.exports = postsRouter;
