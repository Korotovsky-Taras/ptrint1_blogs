import Redis from "ioredis";

const redisKey = 'queries'

class ReteLimiter {
    private redis: Redis;

    constructor() {
        this.redis = new Redis()
    }

    getCounter(key: string) : Promise<number | null> {
        return this.redis.get(key).then(val => val === null ? null : JSON.parse(val))
    }

    incCounter(key: string) {
        return this.redis.incr(key)
    }

    setExCounter(key: string, val: number, seconds: number) {
        return this.redis.setex(key, seconds, val)
    }

    setEx(key: string, seconds: number) {
        return this.redis.expire(key, seconds);
    }

    getTtl(key: string) {
        return this.redis.ttl(key);
    }

    entries() {
        return this.redis.hgetall(redisKey).then(queries => (
            Object.keys(queries).map((key) => [key, JSON.parse(queries[key])])
        ))
    }

    delete(key: string) {
        return this.redis.hdel(redisKey, key)
    }

    clear() {
        return this.redis.flushdb()
    }
}

export const rateLimiter = new ReteLimiter();