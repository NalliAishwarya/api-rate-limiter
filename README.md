# API Rate Limiter & Abuse Control

A Redis-backed API rate limiter built using Node.js and TypeScript to protect backend APIs from excessive and abusive traffic.

## Problem Statement

Backend APIs can be overwhelmed by too many requests from a single client, either accidentally or maliciously.  
This can lead to performance degradation, downtime, or security issues.

This project implements a rate-limiting mechanism to:
- Control request frequency
- Protect APIs from abuse
- Ensure fair usage for all clients

## Solution Overview

The system enforces request limits using a **Token Bucket algorithm** backed by **Redis**.

It supports:
- Logged-in users (rate-limited per user)
- Anonymous users (rate-limited per IP)
- Endpoint-specific rate limits

Redis is used to maintain state across requests and instances.

## Features

- Token Bucket rate limiting
- Hybrid user + IP identification
- Endpoint-specific limits
- Redis TTL-based automatic cleanup
- Standard rate limit HTTP headers
- Express middleware-based design

## Tech Stack

- Node.js
- TypeScript
- Express.js
- Redis
- Docker (for Redis)

## How It Works

1. Each request is identified by:
   - `x-user-id` header (if present), or
   - Client IP address
2. Each endpoint has its own rate limit bucket
3. Tokens are consumed per request and refilled over time
4. When tokens are exhausted, the API returns:
   - `429 Too Many Requests`
   - `Retry-After` header

## Rate Limiting Configuration

- Max tokens: 5
- Refill rate: 1 token per second
- TTL per key: 60 seconds


## Running Locally

### 1. Start Redis using Docker
```bash
docker run --name redis-rate-limiter -p 6379:6379 redis
