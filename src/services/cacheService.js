import * as redis from 'redis';

const redisClient = redis.createClient({
    socket: {
        host: 'localhost',
        port: 6379
    }
});

async function connectRedis() {

  redisClient.on('error', (err) => {
        console.error('Redis error', err);
    });

    redisClient.on('connect', () => { 
        console.log('Connected to Redis');
    });

    await redisClient.connect();

   return redisClient;
}

export { connectRedis, redisClient };