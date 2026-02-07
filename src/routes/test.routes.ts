import { Router } from "express";
import { rateLimiter } from "../middleware/rateLimiter";

const router = Router();

router.get("/test", rateLimiter, (req, res) => {
  res.json({ message: "Request successful" });
});

export default router;
