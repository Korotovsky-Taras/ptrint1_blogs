import crypto from "node:crypto";
import {appConfig} from "./config";
import {AuthTokenPass, AuthVerifiedTokenPass} from "../types/login";
import {withObjectValue} from "./withUserId";
import {BinaryToTextEncoding, randomUUID} from "crypto";

const {tokenSecret} = appConfig;

const signatureDigest: BinaryToTextEncoding = 'base64url';

export const createAccessToken = (userId: string) : AuthTokenPass => {
    let expiredDate: Date = new Date();
    expiredDate.setTime(expiredDate.getTime() + 10 * 1000);
    return createToken(userId, expiredDate.toISOString())
}

export const createRefreshToken = (userId: string) : AuthTokenPass => {
    let expiredDate: Date = new Date();
    expiredDate.setTime(expiredDate.getTime() + 20 * 1000);
    return createToken(userId, expiredDate.toISOString())
}

export const createExpiredRefreshToken = (userId: string) : AuthTokenPass => {
    return createToken(userId, new Date().toISOString())
}

const createToken = (userId: string, expiredIn: string) : AuthTokenPass => {
    const uuid = randomUUID();

    const head = Buffer.from(
        JSON.stringify({ alg: 'HS256', typ: 'jwt' })
    ).toString('base64');
    const body = Buffer.from(
        JSON.stringify({ userId, expiredIn, uuid })
    ).toString('base64');
    let signature = crypto
        .createHmac('SHA256', tokenSecret)
        .update(`${head}.${body}`)
        .digest(signatureDigest);

    return {
        token: `${head}.${body}.${signature}`,
        uuid
    }
}

export const verifyToken = (token: string) : AuthVerifiedTokenPass | null => {
    if (!token) {
        return null;
    }

    let tokenParts = token.split('.');

    if (tokenParts.length < 3) {
        return null;
    }

    const buffer = Buffer.from(tokenParts[1], 'base64');
    const payload = JSON.parse(buffer.toString());
    const userId = withObjectValue(payload, "userId");
    const expiredIn = withObjectValue(payload, "expiredIn");
    const uuid = withObjectValue(payload, "uuid");

    let signature = crypto
        .createHmac('SHA256', tokenSecret)
        .update(`${tokenParts[0]}.${tokenParts[1]}`)
        .digest(signatureDigest);

    const isNotExpired = expiredIn && new Date(expiredIn).getTime() > new Date().getTime();
    const isSignatureEqual = signature === tokenParts[2];

    if (userId && uuid && isNotExpired && isSignatureEqual) {
        return {
            userId,
            uuid
        }
    }

    return null;
}

