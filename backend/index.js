import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import os from "os";
import ordersRoute from "./routes/orders.js";
import usersRoute from "./routes/users.js";
import productsRoute from "./routes/products.js";
import cartRoute from "./routes/cart.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: true, //поменять потом на конкретный URL на проде
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/orders", ordersRoute);
app.use("/api/users", usersRoute);
app.use("/api/products", productsRoute);
app.use("/api/cart", cartRoute);

const PORT = 4000;
const HOST = "0.0.0.0";
app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
  console.log(`Local: http://localhost:${PORT}`);
  const networkInterfaces = os.networkInterfaces();
  Object.keys(networkInterfaces).forEach((interfaceName) => {
    networkInterfaces[interfaceName].forEach((iface) => {
      if (iface.family === "IPv4" && !iface.internal) {
        console.log(`Network: http://${iface.address}:${PORT}`);
      }
    });
  });
});

export default app;
