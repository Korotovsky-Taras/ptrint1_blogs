import {NextFunction, Request, Response} from "express";
import {blogsRepository, postsRepository} from "../repositories";
import {
    IPostsRouterController,
    ParamIdModel,
    Post,
    PostViewModel,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsBody,
    Status
} from "../types";
import {PostsDto} from "../dto/posts.dto";
import {PostsCreateModel, PostsUpdateModel} from "../types/request/posts";
import {ApiError} from "../utils/ApiError";


export class PostsRouterController implements IPostsRouterController {

    getAll(req: Request, res: Response<PostViewModel[]>, next: NextFunction) {
        const posts: Post[] = postsRepository.getPosts();
        return res.status(Status.OK).send(PostsDto.allPosts(posts));
    }

    createPost(req: RequestWithBody<PostsCreateModel>, res: Response<PostViewModel>, next: NextFunction) {
        const blog = blogsRepository.findBlogById(Number(req.body.blogId))
        if (!blog) {
            throw new ApiError(Status.BAD_REQUEST, [{
                field: "blogId",
                message: "wrong blog id"
            }])
        }
        const post = postsRepository.createPost(req.body, blog);
        return res.status(Status.CREATED).send(PostsDto.post(post));
    }

    getPost(req: RequestWithParamsBody<ParamIdModel, PostsCreateModel>, res: Response<PostViewModel | null>, next: NextFunction) {
        const post = postsRepository.findPostById(req.params.id);
        if (post) {
            return res.status(Status.OK).send(PostsDto.post(post));
        }
        return res.sendStatus(Status.NOT_FOUND);
    }

    updatePost(req: RequestWithParamsBody<ParamIdModel, PostsUpdateModel>, res: Response, next: NextFunction) {
        const post = postsRepository.updatePostById(req.params.id, req.body);
        if (post) {
            return res.sendStatus(Status.NO_CONTENT);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }

    deletePost(req: RequestWithParams<ParamIdModel>, res: Response, next: NextFunction) {
        const isDeleted = postsRepository.deletePostById(req.params.id);
        if (isDeleted) {
            return res.sendStatus(Status.NO_CONTENT);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }
}