const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

// ============================ CREATE POSTS =====================
async function addAPost(post) {
  const newPost = await prisma.post.create({
    data: {
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl,
      status: post.status,
      shared: post.shared,
      authorId: post.author,
    },
  });
  return newPost;
}

// ============================= READ POSTS ========================
// Get All Posts
async function getAllPosts() {
  const posts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
    },
    include: {
      comments: true,
      author:{
        select:{
          username: true,
          avatar: true
        }
      }
    },
    orderBy: {
      likes: "desc",
    },
  });
  return posts;
}
// Get all draft posts
async function getAllDraftPosts(author) {
  try {
    const drafts = await prisma.post.findMany({
      where: {
        status: "DRAFT",
        authorId: author,
      },
      include:{
      _count:{
        select:{
          comments: true
        }
      }
    }
    });
    return drafts;
  } catch (error) {
    console.error("Error when fetching drafts in the database", error.message);
    throw error;
  }
}
// Get post by id
async function getPostById(postId) {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      author: {
        select: {
          username: true,
          avatar: true
        },
      },
      comments: {
        include: {
          user: {
            select: { username: true,id: true},
          },
        },
        orderBy: {
          likes: "desc",
        },
      },
    },
  });
  return post;
}
// Get authors published posts
async function authorsPublishedPosts(author) {
  const posts = await prisma.post.findMany({
    where: {
      authorId: author,
      status: "PUBLISHED",
    },
    include:{
      _count:{
        select:{
          comments: true
        }
      }
    }
  });
  return posts;
}
//
// ================================= PATCH/UPDATE POST  =========================
//
async function publishPost(id, ownerId) {
  const post = await prisma.post.update({
    where: {
      id: id,
      authorId: ownerId,
    },
    data: {
      status: "PUBLISHED",
    },
  });
  return post;
}
async function updatePost(update) {
  const updatedPost = await prisma.post.update({
    where: {
      id: update.id,
      authorId: update.ownerId,
    },
    data: {
      title: update.title,
      content: update.content,
      imageUrl: update.imageUrl,
      shared: update.ifShared,
      status: update.status,
    },
  });
  return updatedPost;
}
//
//   ================================ DELETE POST ======================
//
async function deletePost(postId, ownerId) {
  try {
    await prisma.post.delete({
      where: {
        id: postId,
        authorId: ownerId,
      },
    });
    return true;
  } catch (error) {
    console.error("Error occurred when deleting the post");
    throw error;
  }
}
module.exports = {
  addAPost,
  getAllPosts,
  getAllDraftPosts,
  getPostById,
  authorsPublishedPosts,
  publishPost,
  updatePost,
  deletePost,
};
