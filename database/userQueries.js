const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

//
// ===================== CREATE =====================
// New User
async function addUser(name, email, hash, role) {
  const newUser = await prisma.user.create({
    data: {
      username: name,
      email: email,
      password: hash,
      role: role,
    },
  });
  return newUser;
}

//
//  ======================= READ ====================
//
async function checkIfEmailExists(userEmail) {
  const exists = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
    select:{
        email: true
    }
  });
  return exists;
}
// Get user by email
async function getUserByEmail(email) {
  const user = await prisma.user.findUnique({
    where:{
      email: email,
    },
    include:{
      posts: {
        orderBy: {
          createdAt: 'asc'
        }
      },
      comments: true
    }
  });
  return user;
}
// Get user by id
async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where:{
      id: id
    }
  });
  return user;
}

//
// ============================= UPDATE =======================
//

module.exports = {
  addUser,
  checkIfEmailExists,
  getUserByEmail,
  getUserById,
};
