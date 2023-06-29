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

    getAll(req: Request, res: Response<BlogViewModel[]>, next: NextFunction) {
        const blogs: Blog[] = blogsRepository.getBlogs();
        return res.status(Status.OK).send(BlogsDto.allBlogs(blogs));
    }

    createBlog(req: RequestWithBody<BlogCreateModel>, res: Response<BlogViewModel>, next: NextFunction) {
        const blog: Blog = blogsRepository.createBlog(req.body);
        return res.status(Status.CREATED).send(BlogsDto.blog(blog));
    }

    getBlog(req: RequestWithParamsBody<ParamIdModel, BlogCreateModel>, res: Response<BlogViewModel | null>, next: NextFunction) {
        const blog = blogsRepository.findBlogById(Number(req.params.id));
        if (blog) {
            return res.status(Status.OK).send(BlogsDto.blog(blog));
        }
        return res.sendStatus(Status.NOT_FOUND);
    }

    updateBlog(req: RequestWithParamsBody<ParamIdModel, BlogUpdateModel>, res: Response, next: NextFunction) {
        const blog = blogsRepository.updateBlogById(Number(req.params.id), req.body);
        if (blog) {
            return res.sendStatus(Status.NO_CONTENT);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }

    deleteBlog(req: RequestWithParams<ParamIdModel>, res: Response, next: NextFunction) {
        const isDeleted = blogsRepository.deleteBlogById(Number(req.params.id));
        if (isDeleted) {
            return res.sendStatus(Status.NO_CONTENT);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }
}