import * as userRepo from "../repositories/user.repository.js";

export async function getCurrentUser(firebaseUid) {
  const user = await userRepo.findUserByFirebaseUid(firebaseUid);

  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  return user;
}

export async function createUserIfNotExists({
  uid,
  email,
  firstName,
  lastName,
}) {
  if (!uid || !email) {
    throw { status: 400, message: "Invalid user data" };
  }

  const exists = await userRepo.userExists(uid);
  if (exists) {
    return { alreadyExists: true };
  }

  await userRepo.createUser(uid, email, firstName, lastName);

  return { created: true };
}
