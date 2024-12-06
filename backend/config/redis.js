const redis = require("redis");
require("dotenv").config();

let client;

const REFRESH_TOKEN_EXPIRE_TIME = 24 * 60 * 60; // 1 day

const handleEventConnection = (instanceRedis) => {
  instanceRedis.on("connect", function () {
    console.log("Redis client connected");
  });

  instanceRedis.on("ready", function () {
    console.log("Redis client ready");
  });

  instanceRedis.on("reconnecting", function () {
    console.log("Redis client reconnecting");
  });

  instanceRedis.on("end", function () {
    console.log("Redis client connection closed");
  });

  instanceRedis.on("error", function (err) {
    console.log("Redis client error", err);
  });

  instanceRedis.on("warning", function (warning) {
    console.log("Redis client warning: " + warning);
  });
};

const init = async () => {
  if (!client) {
    client = redis.createClient({
      url: process.env.URL_REDIS,
    });

    handleEventConnection(client);

    await client.connect();
  }
};

const get = () => client;

const del = async () => {
  if (client) {
    await client.disconnect();
  }
};

const storeKey = async (key, value) => {
  await client.set(key, value, {
    EX: REFRESH_TOKEN_EXPIRE_TIME,
  });
};

const getKey = async (key) => {
  return await client.get(key);
};

const deleteKey = async (key) => {
  await client.del(key);
};

module.exports = { init, get, del, storeKey, getKey, deleteKey };
