import {authBasicValidation} from "../middlewares/auth-basic-validation";
import {PostsRouterController} from "../controllers/PostsRouterController";
import {postsCreationValidator} from "../middlewares/posts-validation";
import {IPostsRouterController, Route, RouterMethod} from "../types";


const postsRouterController = new PostsRouterController();

const postsRoute: Route<PostsRouterController> = {
    route: "/posts",
    method: RouterMethod.GET,
    controller: postsRouterController,
    action: 'getAll',
}

const postSingleRoute: Route<PostsRouterController> = {
    route: "/posts/:id",
    method: RouterMethod.GET,
    controller: postsRouterController,
    action: 'getPost',
}

const postSingleUpdateRoute: Route<PostsRouterController> = {
    route: "/posts/:id",
    method: RouterMethod.PUT,
    controller: postsRouterController,
    action: 'updatePost',
    middlewares: [
        authBasicValidation,
        postsCreationValidator
    ]
}

const postsCreationRoute: Route<PostsRouterController> = {
    route: "/posts",
    method: RouterMethod.POST,
    controller: postsRouterController,
    action: 'createPost',
    middlewares: [
        authBasicValidation,
        postsCreationValidator
    ]
}

const postsDeletingRoute: Route<PostsRouterController> = {
    route: "/posts/:id",
    method: RouterMethod.DELETE,
    controller: postsRouterController,
    action: 'deletePost',
    middlewares: [
        authBasicValidation,
    ]
}

export const postsRoutes: Route<IPostsRouterController>[] = [
    postsRoute,
    postSingleRoute,
    postsCreationRoute,
    postsDeletingRoute,
    postSingleUpdateRoute,
];





