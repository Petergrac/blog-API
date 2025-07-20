const likesShareDb = require("../database/sharesLikesQuery");

// Like a post
async function addLikeToPost(req, res, next) {
  const { id } = req.params;
  try {
    // Check if the user has already liked
    const hasLiked = await likesShareDb.getPostLikers(id, req.user.id);
    if (hasLiked) {
      return res.status(200).json({ message: "Post already liked" });
    }
    // Update both tables
    const likedPost = await likesShareDb.likePost(id);
    const addUserLike = await likesShareDb.postLikers(id, req.user.id);
    if (!likedPost && addUserLike) {
      return res
        .status(401)
        .json({ message: "Could not update the post likes" });
    };
    return res.status(200).json({ likedPost });
  } catch (error) {
    console.error("Could not add like to the post", error.message);
    next(error);
  }
}

// Like a comment
async function likeComment(req, res, next) {
  try {
    const { id: commentId } = req.params;
    // Check if the user has already liked 
    const hasLiked = await likesShareDb.getCommentLikers(commentId, req.user.id);
    if(hasLiked){
        return res.status(200).json({message:'Comment already liked'});
    }
    // Update both tables
    const updatedComment = await likesShareDb.likeComment(commentId);
    const commentLiker = await likesShareDb.commentLikers(commentId, req.user.id);
    if (!updatedComment && !commentLiker) {
      return res.status(401).json({ message: "Could not add the like" });
    };
    return res.status(200).json({ updatedComment });
  } catch (error) {
    console.error("Could not update the comment's likes ", error.message);
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
