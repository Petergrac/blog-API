const likesShareDb = require("../database/sharesLikesQuery");

// Like a post
async function addLikeToPost(req, res, next) {
  const { id } = req.params;
  const userId = req.user.id;
  if (!userId) return res.sendStatus(401);
  try {
    // Check if the user has already liked
    const hasLiked = await likesShareDb.getUsersWhoLikePost(id, userId);
    if (hasLiked) {
      // Dislike the post
      const updatedPost = await likesShareDb.togglePostLike(
        id,
        userId,
        Boolean(false)
      );
      return res.status(200).json({ updatedPost });
    }
    // Like the post
    const updatedPost = await likesShareDb.togglePostLike(
      id,
      userId,
      Boolean(true)
    );
    return res.status(200).json({ updatedPost });
  } catch (error) {
    console.error("Could not add like to the post", error.message);
    next(error);
  }
}

// Like a comment
async function likeComment(req, res, next) {
  try {
    const { id: commentId } = req.params;
    const userId = req.user.id;
    if (!userId) return res.sendStatus(401);
    // Toggle comments based on the records
    const hasLiked = await likesShareDb.getUsersWhoLikeComment(
      commentId,
      userId
    );

    if (hasLiked) {
      // Dislike the comment
      const updatedComment = await likesShareDb.toggleCommentLike(
        commentId,
        userId,
        Boolean(false)
      );
      return res.status(200).json({ updatedComment });
    }
    // Like a comment
    const updatedComment = await likesShareDb.toggleCommentLike(
      commentId,
      userId,
      Boolean(true)
    );
    return res.status(200).json({ updatedComment });
  } catch (error) {
    console.error("Could not update the comment likes", error.message);
    next(error);
  }
}

// Share a post
async function sharePost(req, res, next) {
  try {
    const { id: postId } = req.params;
    const sharedPost = await likesShareDb.sharePost(postId, true);
    if (!sharedPost) {
      return res.status(400).json({ message: "Could not share post" });
    }
    return res.status(200).json({ sharedPost });
  } catch (error) {
    console.error("Failed to share the post ", error.message);
    next(error);
  }
}

module.exports = {
  likeComment,
  addLikeToPost,
  sharePost,
};
