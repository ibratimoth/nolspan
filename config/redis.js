const Redis = require('ioredis');
const dotenv = require('dotenv');

dotenv.config();

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: 6379,
  maxRetriesPerRequest: null,
});

redisClient.on('connect', () => console.log('[Redis] Connected to my-redis'));
redisClient.on('error', (err) => console.error('[Redis] Error:', err));

// Test connection immediately
redisClient.ping().then((res) => {
  console.log(`[Redis] Ping response: ${res}`);
}).catch((err) => {
  console.error('[Redis] Ping error:', err);
});

module.exports = redisClient;