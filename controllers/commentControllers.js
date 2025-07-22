const commentDb = require("../database/commentQuery");

// Adding a comment
async function addComment(req, res, next) {
  try {
    const { postId } = req.params;
    const { comment } = req.body;
    const owner = req.user.id;
    if (!owner)
      return res
        .status(200)
        .json({ message: "You are not authorized to comment" });
    if (comment === "") {
      return res.status(200).json({ message: "Comment should not be empty" });
    } //   Add it to the database
    const newComment = await commentDb.addCommentToPost(comment, postId, owner);
    if (newComment) {
      return res.status(202).json({ newComment });
    }
    return res.status(202).json({ message: "Could not add the comment" });
  } catch (error) {
    console.error("Could not add the comment", error.message);
    next(error);
  }
}

// Patch a comment
async function patchComment(req, res, next) {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;
    const { content } = req.body;
    if (!commentId && !userId) {
      return res.status(200).json({ message: "Comment not found" });
    }
    if (content === "") {
      return res.status(204).json({ message: "Content Can't be empty" });
    }
    const newComment = await commentDb.updateComment(
      content,
      commentId,
      userId
    );
    if (newComment) {
      return res.status(200).json({ newComment });
    }
  } catch (error) {
    console.error("Could not update comment", error.message);
    next(error);
  }
}
// Delete a comment
async function deleteComment(req, res, next) {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;
    if (!commentId && !userId) {
      return res.status(200).json({ message: "Comment not found" });
    }
    const isDone = await commentDb.deleteComment(commentId, userId);

    if (isDone) {
      return res.status(200).json({ message: "Comment deleted" });
    }
    return res.status(400).json({ message: "Comment could not be deleted" });
  } catch (error) {
    res.status(200).json({ message: "Comment deleted" });
    console.error("Could not delete the comment");
    next(error);
  }
}

module.exports = {
  addComment,
  patchComment,
  deleteComment,
};
