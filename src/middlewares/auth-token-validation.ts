import {NextFunction, Request, Response} from "express";
import {Status} from "../types";
import {verifyAuthToken} from "../utils/authToken";
import {AuthTokenPass} from "../types/login";

export const authTokenValidation = (req: Request, res: Response, next: NextFunction) => {
    const {authorization} = req.headers;
    if (authorization) {
        const authorizationData = authorization.split(" ")
        if (authorizationData.length > 1 && authorizationData[0] === 'Bearer') {
            const bearerToken = authorizationData[1];
            const tokenPass: AuthTokenPass | null = verifyAuthToken(bearerToken);
            if (tokenPass) {
                req.userId = tokenPass.userId;
                return next();
            }
        }
    }
    res.sendStatus(Status.UNATHORIZED);
}