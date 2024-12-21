const redis = require("redis");

// Redis Client
const redisClient = redis.createClient();
redisClient.on("error", (err) => console.error("Redis error:", err));

// Set cache with expiration time
function setCache(key, value, expiration = 3600) {
  redisClient.setex(key, expiration, JSON.stringify(value), (err, response) => {
    if (err) {
      console.error(`Error setting cache for key: ${key}`, err);
    } else {
      console.log(
        `Cache set for key: ${key} with expiration of ${expiration} seconds`
      );
    }
  });
}

// Get cache value by key
function getCache(key, callback) {
  redisClient.get(key, (err, data) => {
    if (err) {
      console.error(`Error retrieving cache for key: ${key}`, err);
      callback(err, null);
    } else if (data) {
      console.log(`Cache hit for key: ${key}`);
      callback(null, JSON.parse(data));
    } else {
      console.log(`Cache miss for key: ${key}`);
      callback(null, null);
    }
  });
}

// Delete cache for a key
function deleteCache(key, callback) {
  redisClient.del(key, (err, response) => {
    if (err) {
      console.error(`Error deleting cache for key: ${key}`, err);
      callback(err);
    } else {
      console.log(`Cache deleted for key: ${key}`);
      callback(null, response);
    }
  });
}

module.exports = {
  setCache,
  getCache,
  deleteCache,
};
