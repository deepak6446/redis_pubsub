/***
 * connect to redis and return redis client
 */
const redis = require("redis");
const bluebird = require('bluebird')
bluebird.promisifyAll(redis.RedisClient.prototype);

const pubClient = redis.createClient(process.env.redisPORT, 'redis');
const redisClient = redis.createClient(process.env.redisPORT, 'redis');

pubClient.on("error", (err) => { console.log("Error " + err); });
redisClient.on("error", (err) => { console.log("Error " + err); });

redisClient.getAsync('foo').then((res)=>{
    console.log('Redis Connected', res)
}); 

const subClient = () => {
    return redis.createClient(process.env.redisPORT, 'redis');
}

module.exports = {
    subClient, 
    pubClient,
    redisClient
}