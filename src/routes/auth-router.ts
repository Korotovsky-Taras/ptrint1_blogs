import {IAuthRouterController, Route, RouterMethod} from "../types";
import {authRouterController} from "../controllers/AuthRouterController";
import {loginCreationValidator} from "../middlewares/login-create-validation";
import {authTokenValidation} from "../middlewares/auth-token-validation";
import {
    authCodeValidation,
    authEmailValidation,
    authRegistrationValidation
} from "../middlewares/auth-registration-validation";


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

export const authRegistrationRoute: Route<IAuthRouterController> = {
    route: "/auth/registration",
    method: RouterMethod.POST,
    controller: authRouterController,
    action: 'registration',
    middlewares: [
        authRegistrationValidation
    ]
}

export const authRegistrationConfirmationRoute: Route<IAuthRouterController> = {
    route: "/auth/registration-confirmation",
    method: RouterMethod.POST,
    controller: authRouterController,
    action: 'registrationConfirmation',
    middlewares: [
        authCodeValidation
    ]
}

export const authRegistrationEmailResendingRoute: Route<IAuthRouterController> = {
    route: "/auth/registration-email-resending",
    method: RouterMethod.POST,
    controller: authRouterController,
    action: 'registrationEmailResending',
    middlewares: [
        authEmailValidation
    ]
}

export const authRoutes: Route<IAuthRouterController>[] = [
    authRegistrationEmailResendingRoute,
    authRegistrationConfirmationRoute,
    authRegistrationRoute,
    authLoginRoute,
    authMeRoute
];