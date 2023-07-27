import {ICommentsRouterController, Route, RouterMethod} from "../types";
import {commentsRouterController} from "../controllers/CommentsRouterController";
import {authTokenValidation} from "../middlewares/auth-token-validation";


export const commentSingleRoute: Route<ICommentsRouterController> = {
    route: "/comments/:id",
    method: RouterMethod.GET,
    controller: commentsRouterController,
    action: 'getComment',
}

export const deleteSingleRoute: Route<ICommentsRouterController> = {
    route: "/comments/:id",
    method: RouterMethod.DELETE,
    controller: commentsRouterController,
    action: 'deleteComment',
    middlewares: [
        authTokenValidation
    ]
}

export const updateSingleRoute: Route<ICommentsRouterController> = {
    route: "/comments/:id",
    method: RouterMethod.PUT,
    controller: commentsRouterController,
    action: 'updateComment',
    middlewares: [
        authTokenValidation
    ]
}

export const commentsRoutes: Route<ICommentsRouterController>[] = [
    commentSingleRoute,
    deleteSingleRoute,
    updateSingleRoute,
];