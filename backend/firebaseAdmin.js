import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS 
  || path.resolve(__dirname, "secrets", "firebase.json");

const serviceAccount = JSON.parse(
  readFileSync(credentialsPath, "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
