import {NextFunction, Request, Response} from "express";
import {blogsRepository} from "../repositories";

import {
    BlogCreateModel,
    BlogUpdateModel,
    BlogViewModel,
    IBlogsRouterController,
    ParamIdModel,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsBody,
    Status
} from "../types";


export class BlogsRouterController implements IBlogsRouterController {

    async getAll(req: Request, res: Response<BlogViewModel[]>, next: NextFunction) {
        const blogs: BlogViewModel[] = await blogsRepository.getBlogs();
        return res.status(Status.OK).send(blogs);
    }

    async createBlog(req: RequestWithBody<BlogCreateModel>, res: Response<BlogViewModel>, next: NextFunction) {
        const blog: BlogViewModel = await blogsRepository.createBlog(req.body);
        return res.status(Status.CREATED).send(blog);
    }

    async getBlog(req: RequestWithParamsBody<ParamIdModel, BlogCreateModel>, res: Response<BlogViewModel | null>, next: NextFunction) {
        const blog: BlogViewModel | null = await blogsRepository.findBlogById(req.params.id);
        if (blog) {
            return res.status(Status.OK).send(blog);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }

    async updateBlog(req: RequestWithParamsBody<ParamIdModel, BlogUpdateModel>, res: Response, next: NextFunction) {
        const isUpdated : boolean = await blogsRepository.updateBlogById(req.params.id, req.body);
        if (isUpdated) {
            return res.sendStatus(Status.NO_CONTENT);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }

    async deleteBlog(req: RequestWithParams<ParamIdModel>, res: Response, next: NextFunction) {
        const isDeleted = await blogsRepository.deleteBlogById(req.params.id);
        if (isDeleted) {
            return res.sendStatus(Status.NO_CONTENT);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }
}