import {NextFunction, Request, Response} from "express";
import {Status} from "../types";

export const authBasicValidation = (req: Request, res: Response, next: NextFunction) => {
    const {authorization} = req.headers;
    if (authorization) {
        const authorizationData = authorization.split(" ")
        if (authorizationData.length > 1 && authorizationData[0] === 'Basic') {
            const decoded: string = atob(authorizationData[1]);
            if (decoded.includes(":")) {
                const [login, password] = decoded.split(":");
                if (login.toLowerCase() === process.env.AUTH_LOGIN && password.toLowerCase() === process.env.AUTH_PASSWORD) {
                    return next();
                }
            }
        }
    }
    res.sendStatus(Status.UNATHORIZED);
}