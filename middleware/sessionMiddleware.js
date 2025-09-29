const session = require('express-session');
const RedisStore = require('connect-redis').default;
const redisClient = require('../config/redis');
const logger = require('../logger');
require('dotenv').config();

logger.info('App: Initializing Redis session store...');

// Create RedisStore instance properly
const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'nolspan:',
});

module.exports = function configureSession(app) {
  app.use(
    session({
      name: 'nolspan.sid',
      store: redisStore,
      secret: process.env.SESSION_SECRET || 'secretkey',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // Set true if using HTTPS
        httpOnly: true,
        maxAge: 86400000, // 24 hours
      },
    })
  );
};