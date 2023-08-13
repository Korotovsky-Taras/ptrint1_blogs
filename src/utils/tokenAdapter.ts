import crypto from "node:crypto";
import {appConfig} from "./config";
import {AuthAccessToken, AuthRefreshToken, AuthUserPass} from "../types/login";
import {withExpiredIn, withUserId} from "./withUserId";
import {WithExpiredIn, WithUserId} from "../types";
import {BinaryToTextEncoding} from "crypto";

const {tokenSecret} = appConfig;

const signatureDigest: BinaryToTextEncoding = 'base64url';

export const createAccessToken = (userId: string) : AuthAccessToken => {
    let expiredDate: Date = new Date();
    expiredDate.setTime(expiredDate.getTime() + 10 * 1000);
    return createToken(userId, expiredDate.toISOString())
}

export const createRefreshToken = (userId: string) : AuthRefreshToken => {
    let expiredDate: Date = new Date();
    expiredDate.setTime(expiredDate.getTime() + 20 * 1000);
    return createToken(userId, expiredDate.toISOString())
}

export const createExpiredRefreshToken = (userId: string) : AuthRefreshToken => {
    return createToken(userId, new Date().toISOString())
}

const createToken = (userId: string, expiredIn: string) : string => {
    const head = Buffer.from(
        JSON.stringify({ alg: 'HS256', typ: 'jwt' })
    ).toString('base64');
    const body = Buffer.from(
        JSON.stringify({ userId, expiredIn })
    ).toString('base64');
    let signature = crypto
        .createHmac('SHA256', tokenSecret)
        .update(`${head}.${body}`)
        .digest(signatureDigest);

    return `${head}.${body}.${signature}`
}

export const verifyToken = (token: string) : AuthUserPass | null => {
    if (!token) {
        return null;
    }

    let tokenParts = token.split('.');

    if (tokenParts.length < 3) {
        return null;
    }

    const buffer = Buffer.from(tokenParts[1], 'base64');
    const payload = JSON.parse(buffer.toString());
    const user: WithUserId | null = withUserId(payload);
    const date: WithExpiredIn | null = withExpiredIn(payload);

    let signature = crypto
        .createHmac('SHA256', tokenSecret)
        .update(`${tokenParts[0]}.${tokenParts[1]}`)
        .digest(signatureDigest);


    const isNotExpired = date && new Date(date.expiredIn).getTime() > new Date().getTime();
    const isSignatureEqual = signature === tokenParts[2];

    if ( isNotExpired && isSignatureEqual &&  user) {
        return {
            userId: user.userId,
        }
    }

    return null;
}

