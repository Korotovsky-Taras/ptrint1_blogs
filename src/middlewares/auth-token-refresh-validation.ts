import {NextFunction, Request, Response} from "express";
import {Status} from "../types";
import {authTokenManager} from "../managers/aurhTokenManager";
import {usersRepository} from "../repositories/users-repository";
import {AuthUserPass} from "../types/login";

export const authTokenRefreshValidation = async (req: Request, res: Response, next: NextFunction) => {
    const uuid : string | null = authTokenManager.getRefreshToken(req);
    if (uuid) {
        const userPass: AuthUserPass | null = await usersRepository.checkRefreshToken(uuid)
        if (userPass) {
            req.userId = userPass.userId;
            return next();
        }
    }
    res.sendStatus(Status.UNATHORIZED);
}