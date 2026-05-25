// =========================================================================
// AI GOVERNANCE CONTROL TOWER — SECURE BACKEND RATE LIMITING PROVIDER
// =========================================================================
// This module provides a rateLimitProvider interface and an InMemoryRateLimiter
// to throttle API invocations by user, organization, and endpoint in accordance
// with SaaS standard quotas and compliance limits.
//
// In production, the InMemoryRateLimiter can be hotswapped with Redis/Upstash
// or Vercel KV for shared state across serverless lambda instances.
// =========================================================================

// Per-instance in-memory cache to record request timestamps
const memoryCache = new Map();

// Window configuration: default is 60 minutes
const WINDOW_MS = (parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES, 10) || 60) * 60 * 1000;

// Maximum AI completions permitted per hour
const MAX_RUNS_PER_ORG = parseInt(process.env.RATE_LIMIT_MAX_AI_RUNS_PER_ORG, 10) || 5;
const MAX_RUNS_PER_USER = 3; // Tight threshold to prevent individual credential abuse

/**
 * Clean outdated timestamps that lie outside the evaluation window
 */
function cleanTimestamps(key, windowStart) {
  const timestamps = memoryCache.get(key) || [];
  const validTimestamps = timestamps.filter(ts => ts > windowStart);
  return validTimestamps;
}

/**
 * Standard RateLimitProvider interface
 */
export const rateLimitProvider = {
  /**
   * Evaluates if a request is within permissible limits
   * Returns a structured result with allowance status and resetting details.
   */
  async checkRateLimit(organizationId, userId, endpoint) {
    const now = Date.now();
    const windowStart = now - WINDOW_MS;

    // 1. Enforce User-level limiting (abusive loops mitigation)
    if (userId) {
      const userKey = `user:${userId}:${endpoint}`;
      const userTimestamps = cleanTimestamps(userKey, windowStart);
      
      if (userTimestamps.length >= MAX_RUNS_PER_USER) {
        const resetTime = userTimestamps[0] + WINDOW_MS;
        return {
          allowed: false,
          limit: MAX_RUNS_PER_USER,
          remaining: 0,
          resetTime,
          reason: `User quota exceeded. User limit of ${MAX_RUNS_PER_USER} executions per hour reached. Reset in ${Math.ceil((resetTime - now) / 60000)} minutes.`
        };
      }
      
      userTimestamps.push(now);
      memoryCache.set(userKey, userTimestamps);
    }

    // 2. Enforce Organization-level limiting (SaaS plan quotas enforcement)
    const orgKey = `org:${organizationId}:${endpoint}`;
    const orgTimestamps = cleanTimestamps(orgKey, windowStart);

    if (orgTimestamps.length >= MAX_RUNS_PER_ORG) {
      const resetTime = orgTimestamps[0] + WINDOW_MS;
      return {
        allowed: false,
        limit: MAX_RUNS_PER_ORG,
        remaining: 0,
        resetTime,
        reason: `Organization rate limit reached (${MAX_RUNS_PER_ORG} executions/hour). Upgrade your billing tier to enable more dynamic AI workloads. Reset in ${Math.ceil((resetTime - now) / 60000)} minutes.`
      };
    }

    orgTimestamps.push(now);
    memoryCache.set(orgKey, orgTimestamps);

    const remaining = MAX_RUNS_PER_ORG - orgTimestamps.length;
    const resetTime = orgTimestamps[0] ? orgTimestamps[0] + WINDOW_MS : now + WINDOW_MS;

    return {
      allowed: true,
      limit: MAX_RUNS_PER_ORG,
      remaining,
      resetTime
    };
  }
};

/*
=========================================================================
PRODUCTION REDIS/UPSTASH / VERCEL KV ADAPTER PLACEHOLDER
=========================================================================
To scale this rate limiter horizontally across multiple serverless lambda
functions, deploy Upstash Redis or Vercel KV and swap the checkRateLimit logic:

import { Kv } from '@vercel/kv';

export const redisRateLimitProvider = {
  async checkRateLimit(organizationId, userId, endpoint) {
    const now = Date.now();
    const windowStart = now - WINDOW_MS;
    const orgKey = `ratelimit:org:${organizationId}:${endpoint}`;
    
    // Increment and set TTL in atomic Redis MULTI pipeline
    const count = await Kv.zcount(orgKey, windowStart, now);
    if (count >= MAX_RUNS_PER_ORG) {
      const earliest = await Kv.zrange(orgKey, 0, 0, { withScores: true });
      const resetTime = earliest[1] + WINDOW_MS;
      return { allowed: false, limit: MAX_RUNS_PER_ORG, remaining: 0, resetTime };
    }
    
    await Kv.zadd(orgKey, { score: now, member: now.toString() });
    await Kv.pexpire(orgKey, WINDOW_MS);
    
    return { allowed: true, limit: MAX_RUNS_PER_ORG, remaining: MAX_RUNS_PER_ORG - count - 1 };
  }
};
=========================================================================
*/
