import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import ordersRoute from "./routes/orders.js";
import usersRoute from "./routes/users.js";
import productsRoute from "./routes/products.js";
import cartRoute from "./routes/cart.js";
import statsRoute from "./routes/stats.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/orders", ordersRoute);
app.use("/api/users", usersRoute);
app.use("/api/products", productsRoute);
app.use("/api/cart", cartRoute);
app.use("/api/stats", statsRoute);

const PORT = process.env.PORT || 4000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`🚀 API server running on http://${HOST}:${PORT}`);
});

export default app;