import {NextFunction, Request, Response} from "express";
import {Status} from "../types";
import {verifyToken} from "../utils/tokenAdapter";
import {AuthVerifiedTokenPass} from "../types/login";

export const authTokenAccessValidation = (req: Request, res: Response, next: NextFunction) => {
    const {authorization} = req.headers;
    if (authorization) {
        const authorizationData = authorization.split(" ")
        if (authorizationData.length > 1 && authorizationData[0] === 'Bearer') {
            const bearerToken = authorizationData[1];
            const tokenPass: AuthVerifiedTokenPass | null = verifyToken(bearerToken);
            if (tokenPass) {
                req.userId = tokenPass.userId;
                return next();
            }
        }
    }
    res.sendStatus(Status.UNATHORIZED);
}