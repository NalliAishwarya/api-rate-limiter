import { Request, Response, NextFunction } from "express";
import { isRequestAllowed } from "../services/rateLimiterService";

export async function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //for know user
  // const userId = req.header("x-user-id") || "anonymous";
  const userId = req.header("x-user-id");
const identifier = userId ? `user:${userId}` : `ip:${req.ip}`;

  const route = req.originalUrl;

  const result = await isRequestAllowed(identifier, route);

  res.setHeader("X-RateLimit-Limit", "5");
  res.setHeader("X-RateLimit-Remaining", result.remaining.toString());

  if (!result.allowed) {
    res.setHeader("Retry-After", result.retryAfter.toString());
    console.log("Retry after:", result.retryAfter);

    return res.status(429).json({
      message: "Too many requests. Please try again later."
    });
  }

  next();
}

