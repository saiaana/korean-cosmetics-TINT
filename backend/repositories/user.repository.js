import db from "../db.js";

export async function findByFirebaseUid(firebaseUid, client = db) {
  const res = await client.query(
    `SELECT id, first_name, last_name, email, role FROM users WHERE firebase_uid = $1`,
    [firebaseUid],
  );

  return res.rows[0] || null;
}

export async function updateUserProfile(
  client,
  userId,
  firstName,
  lastName,
  email,
) {
  await client.query(
    `
    UPDATE users
    SET first_name = $1,
        last_name = $2,
        email = $3
    WHERE id = $4
    `,
    [firstName, lastName, email, userId],
  );
}

export async function createUser(firebaseUid, email, firstName, lastName) {
  await db.query(
    `
    INSERT INTO users (firebase_uid, email, first_name, last_name, role)
    VALUES ($1, $2, $3, $4, 'user')
    `,
    [firebaseUid, email, firstName || null, lastName || null],
  );
}

export async function userExists(firebaseUid) {
  const res = await db.query(
    `
    SELECT id
    FROM users
    WHERE firebase_uid = $1
    `,
    [firebaseUid],
  );

  return res.rowCount > 0;
}
