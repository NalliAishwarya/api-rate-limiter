import express from "express";
import testRoutes from "./routes/test.routes";
import { connectRedis } from "./utils/redisClient";

const app = express();
app.use(express.json());

app.use("/api", testRoutes);

const PORT = 3000;

connectRedis().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
