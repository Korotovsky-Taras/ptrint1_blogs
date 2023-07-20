import {IAuthRouterController, RequestWithBody, Status} from "../types";
import {NextFunction, Response} from "express";
import {authService} from "../services/AuthService";
import {AuthLoginModel} from "../types/login";


class AuthRouterController implements IAuthRouterController {
    async login(req: RequestWithBody<AuthLoginModel>, res: Response, next: NextFunction) {
        const isAuth: boolean = await authService.login(req.body);
        if (isAuth) {
            return res.sendStatus(Status.NO_CONTENT)
        }
        return res.sendStatus(Status.UNATHORIZED)
    }
}

export const authRouterController = new AuthRouterController();