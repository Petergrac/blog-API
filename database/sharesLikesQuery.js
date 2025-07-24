const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

// Add or remove a like on a post
async function togglePostLike(postId, userId, like) {
  let updatedPost;
  if (like) {
    await prisma.$transaction(async (prisma) => {
      await prisma.likesOnPosts.create({
        data: {
          userId: userId,
          postId: postId,
        },
      });
      updatedPost = await prisma.post.update({
        where: { id: postId },
        data: { likes: { increment: 1 } },
      });
    });
  } else {
    await prisma.$transaction(async (prisma) => {
      await prisma.likesOnPosts.deleteMany({
        where: {
          userId: userId,
          postId: postId,
        },
      });
      updatedPost = await prisma.post.update({
        where: { id: postId },
        data: { likes: { decrement: 1 } },
      });
    });
  }
  return updatedPost;
}
// Add or remove a like on a comment
async function toggleCommentLike(commentId, userId, like) {
  let updatedComment;
  if (like) {
    // Add record & increment like
    await prisma.$transaction(async (prisma) => {
      // Add record
      await prisma.likesOnComments.create({
        data: {
          commentId: commentId,
          userId: userId,
        },
      });
      // Increment a like
      updatedComment = await prisma.comment.update({
        where: {
          id: commentId,
        },
        data: {
          likes: { increment: 1 },
        },
      });
    });
    return updatedComment;
  } else {
    // Decrement a like in comment and remove record
    await prisma.$transaction(async (prisma) => {
      // Remove the record
      await prisma.likesOnComments.deleteMany({
        where: {
          commentId: commentId,
          userId,
        },
      });

      //  Decrement a like
      updatedComment = await prisma.comment.update({
        where: {
          id: commentId,
        },
        data: {
          likes: { decrement: 1 },
        },
      });
    });
    return updatedComment;
  }
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

// Get users who likes a post
async function getUsersWhoLikePost(postId, userId) {
  const likedRecord = await prisma.likesOnPosts.findUnique({
    where: {
      userId_postId: {
        postId: postId,
        userId: userId,
      },
    },
  });
  return !!likedRecord;
}
// Get users who likes a comment
async function getUsersWhoLikeComment(commentId, userId) {
  const likedRecord = await prisma.likesOnComments.findUnique({
    where: {
      userId_commentId: {
        commentId: commentId,
        userId: userId,
      },
    },
  });
  return !!likedRecord;
}
module.exports = {
  togglePostLike,
  toggleCommentLike,
  sharePost,
  getUsersWhoLikePost,
  getUsersWhoLikeComment,
};
