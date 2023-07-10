import {NextFunction, Request, Response} from "express";
import {postsRepository} from "../repositories";
import {
    IPostsRouterController,
    ParamIdModel,
    PostsCreateModel,
    PostsUpdateModel,
    PostViewModel,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsBody,
    Status
} from "../types";


export class PostsRouterController implements IPostsRouterController {

    async getAll(req: Request, res: Response<PostViewModel[]>, next: NextFunction) {
        const posts: PostViewModel[] = await postsRepository.getPosts();
        return res.status(Status.OK).send(posts);
    }

    async createPost(req: RequestWithBody<PostsCreateModel>, res: Response<PostViewModel>, next: NextFunction) {
        const post: PostViewModel | null = await postsRepository.createPost(req.body);
        if (post) {
            return res.status(Status.CREATED).send(post);
        }
        return res.sendStatus(Status.BAD_REQUEST);
    }

    async getPost(req: RequestWithParamsBody<ParamIdModel, PostsCreateModel>, res: Response<PostViewModel | null>, next: NextFunction) {
        const post: PostViewModel | null = await postsRepository.findPostById(req.params.id);
        if (post) {
            return res.status(Status.OK).send(post);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }

    async updatePost(req: RequestWithParamsBody<ParamIdModel, PostsUpdateModel>, res: Response, next: NextFunction) {
        const post = await postsRepository.updatePostById(req.params.id, req.body);
        if (post) {
            return res.sendStatus(Status.NO_CONTENT);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }

    async deletePost(req: RequestWithParams<ParamIdModel>, res: Response, next: NextFunction) {
        const isDeleted = await postsRepository.deletePostById(req.params.id);
        if (isDeleted) {
            return res.sendStatus(Status.NO_CONTENT);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }
}