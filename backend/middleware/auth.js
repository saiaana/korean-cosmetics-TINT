import admin from "../firebaseAdmin.js";

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Add user data to request
    next();
  } catch (err) {
    console.error("Invalid token:", err);
    return res.status(401).json({ error: "Unauthorized" });
  }
}
