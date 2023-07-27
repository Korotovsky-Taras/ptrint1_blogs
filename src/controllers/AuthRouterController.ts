import {IAuthRouterController, RequestWithBody, Status} from "../types";
import {NextFunction, Request, Response} from "express";
import {authService} from "../services/AuthService";
import {AuthLoginModel, AuthMeViewModel} from "../types/login";


class AuthRouterController implements IAuthRouterController {
    async login(req: RequestWithBody<AuthLoginModel>, res: Response, next: NextFunction) {
        const isAuth: boolean = await authService.login(req.body);
        if (isAuth) {
            return res.sendStatus(Status.NO_CONTENT)
        }
        return res.sendStatus(Status.UNATHORIZED)
    }
    async me(req: Request, res: Response<AuthMeViewModel>, next: NextFunction) {
        if (req.userId) {
            const model: AuthMeViewModel | null = await authService.getAuthUserById(req.userId);

            if (model) {
                return res.status(Status.OK).send(model)
            }
        }
        return res.sendStatus(Status.UNATHORIZED)
    }
}

export const authRouterController = new AuthRouterController();