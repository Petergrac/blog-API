const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

async function getAllPosts() {
  const posts = await prisma.post.findMany({
    include: {
      title: true,
      likes: true,
    },
    include: {
      comments: {
        select: {
          content: true,
        },
      },
    },
    orderBy: {
      likes: "desc",
    },
  });
  return posts;
}

// Get all users
async function getAllUsers() {
  const users = await prisma.user.findMany({
    include: {
      username: true,
      email: true,
      id: true,
    },
    include: {
      posts: {
        select: {
          title: true,
          likes: true,
        },
      },
      comments: {
        select: {
          content: true,
        },
      },
    },
  });
  return users;
}
// Update user's role
async function updateUserRole(userId, role) {
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role: role,
    },
  });
  return updatedUser;
}
module.exports = {
  getAllPosts,
  getAllUsers,
  updateUserRole,
};
