import {NextFunction, Response} from "express";
import {postsRepository} from "../repositories";
import {
    IPostsRouterController,
    PaginationQueryModel,
    ParamIdModel,
    Post,
    PostsCreateModel,
    PostsListViewModel,
    PostsUpdateModel,
    PostViewModel,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsBody,
    RequestWithQuery,
    Status
} from "../types";
import {PostsDto} from "../dto/posts.dto";
import {postsService} from "../services/PostsService";


class PostsRouterController implements IPostsRouterController {

    async getAll(req: RequestWithQuery<PaginationQueryModel<Post>>, res: Response<PostsListViewModel>, next: NextFunction) {
        const posts: PostsListViewModel = await postsRepository.getPosts({}, PostsDto.toRepoQuery(req.query));
        return res.status(Status.OK).send(posts);
    }

    async getPost(req: RequestWithParamsBody<ParamIdModel, PostsCreateModel>, res: Response<PostViewModel | null>, next: NextFunction) {
        const post: PostViewModel | null = await postsRepository.findPostById(req.params.id);
        if (post) {
            return res.status(Status.OK).send(post);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }

    async createPost(req: RequestWithBody<PostsCreateModel>, res: Response<PostViewModel>, next: NextFunction) {
        const post: PostViewModel | null = await postsService.createPost(req.body);
        if (post) {
            return res.status(Status.CREATED).send(post);
        }
        return res.sendStatus(Status.BAD_REQUEST);
    }

    async updatePost(req: RequestWithParamsBody<ParamIdModel, PostsUpdateModel>, res: Response, next: NextFunction) {
        const post = await postsService.updatePostById(req.params.id, req.body);
        if (post) {
            return res.sendStatus(Status.NO_CONTENT);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }

    async deletePost(req: RequestWithParams<ParamIdModel>, res: Response, next: NextFunction) {
        const isDeleted = await postsService.deletePostById(req.params.id);
        if (isDeleted) {
            return res.sendStatus(Status.NO_CONTENT);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }
}

export const postsRouterController = new PostsRouterController();