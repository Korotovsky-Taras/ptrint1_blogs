import {IAuthRouterController, Route, RouterMethod} from "../types";
import {authRouterController} from "../controllers/AuthRouterController";
import {loginCreationValidator} from "../middlewares/login-create-validation";
import {authTokenValidation} from "../middlewares/auth-token-validation";


export const authLoginRoute: Route<IAuthRouterController> = {
    route: "/auth/login",
    method: RouterMethod.POST,
    controller: authRouterController,
    action: 'login',
    middlewares: [
        loginCreationValidator
    ]
}

export const authMeRoute: Route<IAuthRouterController> = {
    route: "/auth/me",
    method: RouterMethod.GET,
    controller: authRouterController,
    action: 'me',
    middlewares: [
        authTokenValidation
    ]
}

export const authRoutes: Route<IAuthRouterController>[] = [
    authLoginRoute,
    authMeRoute
];