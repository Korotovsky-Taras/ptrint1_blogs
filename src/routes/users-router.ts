import {IUsersRouterController, Route, RouterMethod} from "../types";
import {usersRouterController} from "../controllers/UsersRouterController";


export const usersAllRoute: Route<IUsersRouterController> = {
    route: "/users",
    method: RouterMethod.GET,
    controller: usersRouterController,
    action: 'getAll',
}

export const userCreateRoute: Route<IUsersRouterController> = {
    route: "/users",
    method: RouterMethod.POST,
    controller: usersRouterController,
    action: 'createUser',
}

export const usersDeleteRoute: Route<IUsersRouterController> = {
    route: "/users",
    method: RouterMethod.DELETE,
    controller: usersRouterController,
    action: 'deleteUser',
}

export const usersRoutes: Route<IUsersRouterController>[] = [
    usersAllRoute,
    userCreateRoute,
    usersDeleteRoute,
];