import {NextFunction, Request, Response} from "express";

export interface IBlogsRouterController {
    getAll(req: Request, res: Response, next: NextFunction): Response,
    createBlog(req: Request, res: Response, next: NextFunction): Response,
    getBlog(req: Request, res: Response, next: NextFunction): Response,
    updateBlog(req: Request, res: Response, next: NextFunction): Response,
    deleteBlog(req: Request, res: Response, next: NextFunction): Response,
}


export interface ITestingRouterController {
    clearAll(req: Request, res: Response, next: NextFunction): Response,
}

export interface IPostsRouterController {
    getAll(req: Request, res: Response, next: NextFunction): Response,
    createPost(req: Request, res: Response, next: NextFunction): Response,
    getPost(req: Request, res: Response, next: NextFunction): Response,
    updatePost(req: Request, res: Response, next: NextFunction): Response,
    deletePost(req: Request, res: Response, next: NextFunction): Response,
}