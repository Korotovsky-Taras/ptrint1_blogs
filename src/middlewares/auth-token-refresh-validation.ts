import {NextFunction, Request, Response} from "express";
import {Status} from "../types";
import {authTokenManager} from "../managers/aurhTokenManager";
import {AuthUserPass} from "../types/login";
import {verifyToken} from "../utils/tokenAdapter";

export const authTokenRefreshValidation = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken : string | null = authTokenManager.getRefreshToken(req);
    if (refreshToken) {
        const userPass: AuthUserPass | null = verifyToken(refreshToken)
        if (userPass) {
            req.userId = userPass.userId;
            return next();
        }
    }
    res.sendStatus(Status.UNATHORIZED);
}