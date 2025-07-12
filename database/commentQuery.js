const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

// ========================= CREATE COMMENT  ======================
async function addCommentToPost(comment, postId, owner) {
  try {
    const newComment = await prisma.comment.create({
      data: {
        content: comment,
        postId: postId,
        userId: owner,
      },
    });
    return newComment;
  } catch (error) {
    console.error("Error when adding a comment", error.message);
    throw error;
  }
}

//  =========================== READ COMMENT ========================
//
async function getPostComment(postId) {
  const comments = await prisma.comment.findMany({
    where: {
      postId: postId,
    },
  });
  return comments;
}
// ============================= UPDATE COMMENT ========================
//
async function updateComment(content, commentId, ownerId) {
  const comment = await prisma.comment.update({
    where: {
      id: commentId,
      userId: ownerId,
    },
    data: {
      content: content,
    },
  });
  return comment;
}
// ==============================  DELETE COMMENT ========================
//
async function deleteComment(commentId, ownerId) {
  try {
    const comment = await prisma.comment.delete({
      where: {
        id: commentId,
        userId: ownerId,
      },
    });
    return !!comment;
  } catch (error) {
    if (error.code === "P2025") {
      console.error("Comment not found", error.message);
      return false;
    }
  }
}
module.exports = {
  addCommentToPost,
  getPostComment,
  updateComment,
  deleteComment,
};
