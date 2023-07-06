import {NextFunction, Request, Response} from "express";
import {blogsRepository} from "../repositories";
import {BlogsDto} from "../dto/blogs.dto";
import {
    Blog,
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
        const blogs: Blog[] = await blogsRepository.getBlogs();
        return res.status(Status.OK).send(BlogsDto.allBlogs(blogs));
    }

    async createBlog(req: RequestWithBody<BlogCreateModel>, res: Response<BlogViewModel>, next: NextFunction) {
        const blog: Blog = await blogsRepository.createBlog(req.body);
        return res.status(Status.CREATED).send(BlogsDto.blog(blog));
    }

    async getBlog(req: RequestWithParamsBody<ParamIdModel, BlogCreateModel>, res: Response<BlogViewModel | null>, next: NextFunction) {
        const blog = await blogsRepository.findBlogById(Number(req.params.id));
        if (blog) {
            return res.status(Status.OK).send(BlogsDto.blog(blog));
        }
        return res.sendStatus(Status.NOT_FOUND);
    }

    async updateBlog(req: RequestWithParamsBody<ParamIdModel, BlogUpdateModel>, res: Response, next: NextFunction) {
        const isUpdated : boolean = await blogsRepository.updateBlogById(Number(req.params.id), req.body);
        if (isUpdated) {
            return res.sendStatus(Status.NO_CONTENT);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }

    async deleteBlog(req: RequestWithParams<ParamIdModel>, res: Response, next: NextFunction) {
        const isDeleted = await blogsRepository.deleteBlogById(Number(req.params.id));
        if (isDeleted) {
            return res.sendStatus(Status.NO_CONTENT);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }
}