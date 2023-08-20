import {NextFunction, Request, Response} from "express";
import {rateLimiter} from "../managers/redisStore";
import {Status} from "../types";
import {authHelper} from "../managers/authHelper";

const RATE_LIMIT = 5; // Максимальное количество запросов за период времени
const PERIOD = 10; // Период времени в секундах


export const authRateLimiter = (limit: number = RATE_LIMIT, period: number = PERIOD) => {
    return async function (req: Request, res: Response, next: NextFunction) {

        const ip = authHelper.getIp(req);

        if (!ip) {
            return next();
        }

        const endpoint = req.path;

        const key = `${ip}:${endpoint}`;


        const ttl = await rateLimiter.getTtl(key);
        const count: number | null = await rateLimiter.getCounter(key);

        if (!count || ttl < 0) {
            await rateLimiter.setExCounter(key, 1, period);
            return next();
        }

        if (count < limit) {
            await rateLimiter.incCounter(key);
            return next();
        }

        return res.sendStatus(Status.TO_MANY_REQUESTS);
    }
}