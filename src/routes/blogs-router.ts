import {BlogsRouterController} from "../controllers/BlogsRouterController";
import {authBasicValidation} from "../middlewares/auth-basic-validation";
import {blogsCreationValidator} from "../middlewares/blogs-validation";
import {Route, RouterMethod} from "../types";


export const blogsRouterController = new BlogsRouterController();

export const blogsRoute: Route<BlogsRouterController> = {
    route: "/blogs",
    method: RouterMethod.GET,
    controller: blogsRouterController,
    action: 'getAll',
}

const blogSingleRoute: Route<BlogsRouterController> = {
    route: "/blogs/:id",
    method: RouterMethod.GET,
    controller: blogsRouterController,
    action: 'getBlog',
}

const blogSingleUpdateRoute: Route<BlogsRouterController> = {
    route: "/blogs/:id",
    method: RouterMethod.PUT,
    controller: blogsRouterController,
    action: 'updateBlog',
    middlewares: [
        authBasicValidation,
        blogsCreationValidator
    ]
}

const blogsCreationRoute: Route<BlogsRouterController> = {
    route: "/blogs",
    method: RouterMethod.POST,
    controller: blogsRouterController,
    action: 'createBlog',
    middlewares: [
        authBasicValidation,
        blogsCreationValidator
    ]
}

const blogsDeletingRoute: Route<BlogsRouterController> = {
    route: "/blogs/:id",
    method: RouterMethod.DELETE,
    controller: blogsRouterController,
    action: 'deleteBlog',
    middlewares: [
        authBasicValidation,
    ]
}

export const blogRoutes: Route<BlogsRouterController>[] = [
    blogsRoute,
    blogSingleRoute,
    blogsCreationRoute,
    blogsDeletingRoute,
    blogSingleUpdateRoute,
];





