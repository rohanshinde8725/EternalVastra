/**
 * High-performance in-memory cache with TTL and prefix invalidation.
 * Eliminates redundant database roundtrips for read-heavy operations.
 */

class MemoryCache {
  constructor() {
    this.store = new Map();
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  set(key, value, ttlSeconds = 120) {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    this.store.set(key, { value, expiresAt });
    return value;
  }

  del(key) {
    this.store.delete(key);
  }

  delPrefix(prefix) {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }

  flush() {
    this.store.clear();
  }

  /**
   * Express middleware for caching GET responses
   * @param {number} ttlSeconds - Time-to-live in seconds
   * @param {string} cacheGroup - Logical group name (e.g. 'products', 'categories')
   */
  middleware(ttlSeconds = 120, cacheGroup = "") {
    return (req, res, next) => {
      // Only cache GET requests
      if (req.method !== "GET") {
        return next();
      }

      const key = `${cacheGroup || req.baseUrl || "api"}:${req.originalUrl || req.url}`;
      const cachedData = this.get(key);

      if (cachedData) {
        res.setHeader("X-Cache", "HIT");
        res.setHeader("Cache-Control", `public, max-age=${Math.min(ttlSeconds, 60)}, stale-while-revalidate=120`);
        return res.json(cachedData);
      }

      res.setHeader("X-Cache", "MISS");

      // Wrap res.json to capture and cache response payload
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          this.set(key, body, ttlSeconds);
        }
        return originalJson(body);
      };

      next();
    };
  }
}

const cache = new MemoryCache();
module.exports = cache;
