import {NextFunction, Request, Response} from "express";
import {Status} from "../types";
import {authTokenManager} from "../managers/aurhTokenManager";
import {AuthSession, AuthVerifiedTokenPass} from "../types/login";
import {verifyToken} from "../utils/tokenAdapter";
import {authSessionsCollection} from "../db";

export const authTokenRefreshValidation = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken : string | null = authTokenManager.getRefreshToken(req);
    if (refreshToken) {
        const tokenPass: AuthVerifiedTokenPass | null = verifyToken(refreshToken);

        if (tokenPass) {
            const userId = tokenPass.userId;
            const session: AuthSession | null = await authSessionsCollection.findOne({userId})

            if (session && session.uuid === tokenPass.uuid) {
                req.userId = tokenPass.userId;
                return next();
            }
        }
    }
    res.sendStatus(Status.UNATHORIZED);
}