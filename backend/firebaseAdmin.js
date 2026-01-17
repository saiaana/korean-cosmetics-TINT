import admin from "firebase-admin";
import { readFile } from "fs/promises";

const serviceAccount = JSON.parse(
  await readFile(
    new URL(
      "config/tint-2d2cc-firebase-adminsdk-fbsvc-72bb584cbe.json",
      import.meta.url,
    ),
  ),
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
