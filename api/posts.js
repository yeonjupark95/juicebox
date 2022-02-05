// api/posts.js
const express = require("express");
const postsRouter = express.Router();
const { requireUser } = require("./utils");
const { createPost, getPostById, updatePost, getAllPosts } = require("../db");

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

postsRouter.delete("/:postId", requireUser, async (req, res, next) => {
  try {
    const post = await getPostById(req.params.postId);

    if (post && post.author.id === req.user.id) {
      const updatedPost = await updatePost(post.id, { active: false });

      res.send({ post: updatedPost });
    } else {
      // if there was a post, throw unauthorizedUserError, otherwise throw PostNotFoundError
      next(
        post
          ? {
              name: "UnauthorizedUserError",
              message: "You cannot delete a post which is not yours",
            }
          : {
              name: "PostNotFoundError",
              message: "That post does not exist",
            }
      );
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.use((req, res, next) => {
  console.log("A request is being made to /posts");

  next();
});

postsRouter.get("/", async (req, res, next) => {
  try {
    const allPosts = await getAllPosts();
    const posts = allPosts.filter((post) => {
      // keep a post if it is either active, or if it belongs to the current user
      return post.active || (req.user && post.author.id === req.user.id);
    });
    res.send({
      posts,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = postsRouter;
