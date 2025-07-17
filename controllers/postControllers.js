const database = require("../database/postQueries");

// Get all Posts
async function getAllPosts(req, res, next) {
  try {
    const posts = await database.getAllPosts();
    if (posts) res.status(200).json(posts);

  } catch (error) {
    console.log("This error happened in getAllPost middleware", error.message);
    next(error);
  }
}

// Add  a Post
async function addPost(req, res, next) {
  try {
    const { title, content, imageUrl, shared: sharedString, status } = req.body;

    // Check role of the user
    if (req.user.role && req.user.role === "USER") {
      return res.status(401).json({ message: "Only Authors & Admin can post" });
    }
    if (title === undefined || content === undefined) {
      return res.status(204).json({ message: "Some fields are empty" });
    }
    // Allow addition of post
    const shared = false;
    const author = req.user.id;
    const post = { title, content, imageUrl, shared, status, author };
    const newPost = await database.addAPost(post);

    // Return post
    res.status(200).json({ message: "Added Successfully", post: newPost });
  } catch (error) {
    console.error(
      "This error happened in the addPost middleware",
      error.message
    );
    next(error);
  }
}
// Get published posts for a particular author
async function getAuthorPublishedPost(req,res,next) {
  try {
    // Check role of the user
    if (req.user.role && req.user.role === "USER") {
      return res
        .status(401)
        .json({ message: "Only Authors & Admin can access the posts." });
    }
    // Verifying the owner
    const author = req.user.id;
    if (!author) {
      return res
        .status(401)
        .json({ message: "You are not authorized.Please log in or sign up" });
    }
    // Get all published posts
    const posts = await database.authorsPublishedPosts(author);
    if (!posts.length > 0) {
      return res.status(404).json({ message: "No posts", posts });
    }
    return res.status(200).json({ message: "Your posts", posts });
  } catch (error) {
    console.error("Error happened in author's middleware", error.message);
    next(error);
  }
}
// Get add drafts posts
async function getDraftPosts(req, res, next) {
  try {
    // Check role of the user
    if (req.user.role && req.user.role === "USER") {
      return res
        .status(401)
        .json({ message: "Only Authors & Admin can access the drafts." });
    }
    // Verifying the owner
    const author = req.user.id;
    if (!author) {
      return res
        .status(401)
        .json({ message: "You are not authorized.Please log in or sign up" });
    }
    // Get all drafts
    const drafts = await database.getAllDraftPosts(author);
    if (!drafts.length > 0) {
      return res.status(404).json({ message: "No Drafts" });
    }
    return res.status(200).json({ message: "Your Drafts", drafts });
  } catch (error) {
    console.error("This error happened in drafts middleware", error.message);
    next(error);
  }
}

// Get posts by id
async function getPostsById(req, res, next) {
  try {
    const { id } = req.params;
    console.log(id);
    // Retrieving Id
    if (!id) return res.status(404).json({ message: "Post not found" });
    // Get the post by id
    const post = await database.getPostById(id);
    // Check if post exist
    if (!post)
      return res.status(404).json({ message: "This post does not exist" });
    // Verify the authorized client

    // Serve it only if it is PUBLISHED
    if (post.status === "PUBLISHED") {
      console.log(post);
      return res.status(200).json({ message: "The post", post });
    }
    return res
      .status(401)
      .json({ message: "You are not authorized to view this post" });
  } catch (error) {
    console.error(
      "This error happened in getPostById middleware",
      error.message
    );
    next(error);
  }
}
// Get draft by id
async function getDraftById(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) return res.status(404).json({ message: "Post not found" });
    const post = await database.getPostById(id);
    if (post) {
      if (req.user) {
        if (req.user.role === "AUTHOR" || req.user.role === "ADMIN") {
          return res.status(200).json({ message: "Your post", post });
        }
        return res
          .status(401)
          .jso({ message: "You are not authorized to view this post" });
      }
    } else {
      return res.status(404).json({ message: "There is no such post" });
    }
    return res.status(404).json({ message: "Post not found" });
  } catch (error) {
    console.error("Error in the getDraftById", error.message);
    next(error);
  }
}
// Patch post
async function patchPost(req, res, next) {
  try {
    const { id } = req.params;
    const ownerId = req.user.id;
    if (!ownerId)
      return res
        .status(404)
        .json({ message: "Unauthorized.Can't update the post" });
    if (req.user.role === "USER") {
      return res.status(401).json({ message: "You cannot edit this file" });
    }
    // Extract all the data
    const { title, content, imageUrl, shared, status } = req.body;
    let ifShared = null;
    if (shared === "true" || shared === "false") {
      ifShared = Boolean(shared);
    }

    // Update the database
    const update = { title, content, imageUrl, ifShared, status, id, ownerId };
    const updatedPost = await database.updatePost(update);
    if (updatedPost) {
      return res.status(200).json({ message: "Post Updated", updatedPost });
    }
    return res.status(400).json({ message: "Post could not be updated" });
  } catch (error) {
    console.error("Error in patch post middleware", error.message);
    next(error);
  }
}
// Publish post
async function publishPost(req, res, next) {
  try {
    const { id } = req.params;
    const ownerId = req.user.id;
    console.log(ownerId, id);
    if (ownerId && id) {
      const publishPost = await database.publishPost(id, ownerId);
      if (publishPost) {
        return res.status(200).json({ message: "Post published", publishPost });
      }
      return res.status(404).json({ message: "Post not found" });
    }
    return res
      .status(401)
      .json({ message: "You are not authorized to modify the post" });
  } catch (error) {
    console.error(
      "This error happened in the publishPost middleware",
      error.message
    );
    next(error);
  }
}
// Delete Post
async function deletePost(req, res, next) {
  try {
    const { id } = req.params;
    const ownerId = req.user.id;
    if (!id && !ownerId) {
      return res.status(401).json({ message: "You are unauthorized" });
    }
    console.log(id, ownerId);
    const isDone = await database.deletePost(id, ownerId);
    if (isDone) {
      return res.status(200).json({ message: "Post deleted successfully" });
    }
    return res
      .status(400)
      .json({ message: "You are forbidden to perform that action" });
  } catch (error) {
    console.error("Error happened in the delete middleware", error.message);
    next(error);
  }
}
module.exports = {
  getAllPosts,
  addPost,
  getDraftPosts,
  getPostsById,
  getDraftById,
  getAuthorPublishedPost,
  publishPost,
  patchPost,
  deletePost,
};
