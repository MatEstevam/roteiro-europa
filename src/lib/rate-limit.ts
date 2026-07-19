type RateLimitConfig = { windowMs: number; maxRequests: number };

const ipRequests = new Map<string, number[]>();

export function checkRateLimit(
  ip: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const windowStart = now - config.windowMs;

  // Get existing timestamps or initialize empty array
  const timestamps = ipRequests.get(ip) || [];

  // Clean expired entries
  const validTimestamps = timestamps.filter((t) => t > windowStart);

  // Check if request is allowed
  const allowed = validTimestamps.length < config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - validTimestamps.length - (allowed ? 1 : 0));

  if (allowed) {
    validTimestamps.push(now);
  }

  // Update the map
  if (validTimestamps.length > 0) {
    ipRequests.set(ip, validTimestamps);
  } else {
    ipRequests.delete(ip);
  }

  return { allowed, remaining };
}

export const FLIGHT_SEARCH_LIMIT: RateLimitConfig = {
  windowMs: 60000,
  maxRequests: 10,
};

export const ITINERARY_LIMIT: RateLimitConfig = {
  windowMs: 3600000,
  maxRequests: 30,
};
