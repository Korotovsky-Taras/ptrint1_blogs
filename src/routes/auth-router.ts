import {IAuthRouterController, Route, RouterMethod} from "../types";
import {authRouterController} from "../controllers/AuthRouterController";
import {loginCreationValidator} from "../middlewares/login-create-validation";


export const authRoute: Route<IAuthRouterController> = {
    route: "/auth/login",
    method: RouterMethod.POST,
    controller: authRouterController,
    action: 'login',
    middlewares: [
        loginCreationValidator
    ]
}

export const authRoutes: Route<IAuthRouterController>[] = [
    authRoute,
];