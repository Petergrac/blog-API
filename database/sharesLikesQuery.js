const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

// Like a post
async function likePost(postId) {
  const likedPost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      likes: { increment: 1 },
    },
  });
  return likedPost;
}
// Like a comment
async function likeComment(commentId) {
  const updatedComment = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      likes: { increment: 1 },
    },
  });
  return updatedComment;
}
// Share a post
async function sharePost(postId, shareStatus) {
  const sharedPost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      shared: shareStatus,
    },
  });
  return sharedPost;
}
// Track user who likes post
async function postLikers(postId, postLiker) {
  const user = await prisma.likes.create({
    data: {
      postLikes: postLiker,
      postId: postId,
    },
  });
}
// Track user who likes comments
async function commentLikers(id, likerId) {
  const commentLiker = await prisma.likes.create({
    data: {
      commentId: id,
      commentLikes: likerId,
    },
  });
  return commentLiker;
}
// Get users who likes a post
async function getPostLikers(postId, userId) {
  const isAvailable = await prisma.likes.findMany({
    where: {
      postId: postId,
      postLikes: userId,
    },
  });
  return isAvailable.length > 0;
}
// Get users who likes a comment
async function getCommentLikers(commentId, userId) {
  const isAvailable = await prisma.likes.findMany({
    where: {
      commentId: commentId,
      commentLikes: userId,
    },
  });
  return isAvailable.length > 0;
}
module.exports = {
  likePost,
  likeComment,
  sharePost,
  postLikers,
  commentLikers,
  getPostLikers,
  getCommentLikers,
};
