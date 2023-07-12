import {Response} from "express";
import {blogsRepository, postsRepository} from "../repositories";

import {
    BlogCreateModel,
    BlogListViewModel,
    BlogPaginationRepositoryModel,
    BlogPostCreateModel,
    BlogUpdateModel,
    BlogViewModel,
    IBlogsRouterController,
    PaginationQueryModel,
    ParamIdModel,
    PostsListViewModel,
    PostViewModel,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsBody,
    RequestWithParamsQuery,
    RequestWithQuery,
    Status
} from "../types";
import {BlogsDto} from "../dto/blogs.dto";


export class BlogsRouterController implements IBlogsRouterController {

    async getAll(req: RequestWithQuery<PaginationQueryModel>, res: Response<BlogListViewModel>) {
        const query: BlogPaginationRepositoryModel = BlogsDto.toRepoQuery(req.query);
        const model: BlogListViewModel = await blogsRepository.getBlogs(query);
        return res.status(Status.OK).send(model);
    }

    async createBlog(req: RequestWithBody<BlogCreateModel>, res: Response<BlogViewModel>) {
        const blog: BlogViewModel = await blogsRepository.createBlog(req.body);
        return res.status(Status.CREATED).send(blog);
    }

    async createBlogPost(req: RequestWithParamsBody<ParamIdModel, BlogPostCreateModel>, res: Response<PostViewModel>) {
        const post: PostViewModel | null = await postsRepository.createPost({
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.params.id
        });
        if (post) {
            return res.status(Status.CREATED).send(post);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }

    async getBlog(req: RequestWithParams<ParamIdModel>, res: Response<BlogViewModel | null>) {
        const blog: BlogViewModel | null = await blogsRepository.findBlogById(req.params.id);
        if (blog) {
            return res.status(Status.OK).send(blog);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }

    async getBlogPosts(req: RequestWithParamsQuery<ParamIdModel, PaginationQueryModel>, res: Response<PostsListViewModel>) {
        const query: BlogPaginationRepositoryModel = BlogsDto.toRepoQuery(req.query);
        const model: PostsListViewModel | null = await blogsRepository.findBlogPosts(req.params.id, query);
        if (model) {
            return res.status(Status.OK).send(model);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }

    async updateBlog(req: RequestWithParamsBody<ParamIdModel, BlogUpdateModel>, res: Response) {
        const isUpdated : boolean = await blogsRepository.updateBlogById(req.params.id, req.body);
        if (isUpdated) {
            return res.sendStatus(Status.NO_CONTENT);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }

    async deleteBlog(req: RequestWithParams<ParamIdModel>, res: Response) {
        const isDeleted = await blogsRepository.deleteBlogById(req.params.id);
        if (isDeleted) {
            return res.sendStatus(Status.NO_CONTENT);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }
}