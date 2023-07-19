import {IAuthRouterController, RequestWithBody} from "../types";
import {NextFunction, Response} from "express";
import {authService} from "../services/AuthService";
import {AuthLoginModel} from "../types/login";


class AuthRouterController implements IAuthRouterController {
    async login(req: RequestWithBody<AuthLoginModel>, res: Response, next: NextFunction) {
        await authService.login(req.body);
        return res;
    }
}

export const authRouterController = new AuthRouterController();