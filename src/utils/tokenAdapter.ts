import crypto from "node:crypto";
import {appConfig} from "./config";
import {AuthUserPass} from "../types/login";
import {withUserId} from "./withUserId";
import {WithUserId} from "../types";
import {BinaryToTextEncoding} from "crypto";

const {tokenSecret} = appConfig;

const signatureDigest: BinaryToTextEncoding = 'base64url';

export const createAccessToken = (userId: string) : string => {
    const head = Buffer.from(
        JSON.stringify({ alg: 'HS256', typ: 'jwt' })
    ).toString('base64');
    const body = Buffer.from(
        JSON.stringify({ userId })
    ).toString('base64');
    let signature = crypto
        .createHmac('SHA256', tokenSecret)
        .update(`${head}.${body}`)
        .digest(signatureDigest);

    return `${head}.${body}.${signature}`
}

export const verifyAccessToken = (token: string) : AuthUserPass | null => {
    let tokenParts = token.split('.');

    if (tokenParts.length < 3) {
        return null;
    }

    const buffer = Buffer.from(tokenParts[1], 'base64');
    const payload = JSON.parse(buffer.toString());
    const user: WithUserId | null = withUserId(payload);

    let signature = crypto
        .createHmac('SHA256', tokenSecret)
        .update(`${tokenParts[0]}.${tokenParts[1]}`)
        .digest(signatureDigest);


    if (signature === tokenParts[2] && user) {
        return {
            userId: user.userId,
        }
    }

    return null;
}

