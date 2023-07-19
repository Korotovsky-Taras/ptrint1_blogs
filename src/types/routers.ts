import {NextFunction, Request, Response} from "express";

export interface IBlogsRouterController {
    getAll(req: Request, res: Response, next: NextFunction): Promise<Response>,
    createBlog(req: Request, res: Response, next: NextFunction): Promise<Response>,
    createBlogPost(req: Request, res: Response, next: NextFunction): Promise<Response>,
    getBlog(req: Request, res: Response, next: NextFunction): Promise<Response>,
    getBlogPosts(req: Request, res: Response, next: NextFunction): Promise<Response>,
    updateBlog(req: Request, res: Response, next: NextFunction): Promise<Response>,
    deleteBlog(req: Request, res: Response, next: NextFunction): Promise<Response>,
}

export interface ITestingRouterController {
    clearAll(req: Request, res: Response, next: NextFunction): Promise<Response>,
}

export interface IPostsRouterController {
    getAll(req: Request, res: Response, next: NextFunction): Promise<Response>,
    createPost(req: Request, res: Response, next: NextFunction): Promise<Response>,
    getPost(req: Request, res: Response, next: NextFunction): Promise<Response>,
    updatePost(req: Request, res: Response, next: NextFunction): Promise<Response>,
    deletePost(req: Request, res: Response, next: NextFunction): Promise<Response>,
}

export interface ILogsRouterController {
    getAll(req: Request, res: Response, next: NextFunction): Promise<Response>,
    deleteAll(req: Request, res: Response, next: NextFunction): Promise<Response>,
}

export interface IAuthRouterController {
    login(req: Request, res: Response, next: NextFunction): Promise<Response>,
}

export interface IUsersRouterController {
    getAll(req: Request, res: Response, next: NextFunction): Promise<Response>,
    createUser(req: Request, res: Response, next: NextFunction): Promise<Response>,
    deleteUser(req: Request, res: Response, next: NextFunction): Promise<Response>,
}