import {NextFunction, Request, Response} from "express";

export interface IBlogsRouterController {
    getAll(req: Request, res: Response, next: NextFunction): Promise<Response>,
    createBlog(req: Request, res: Response, next: NextFunction): Promise<Response>,
    getBlog(req: Request, res: Response, next: NextFunction): Promise<Response>,
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