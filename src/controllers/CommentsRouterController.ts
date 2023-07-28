import {ICommentsRouterController, ParamIdModel, RequestWithParams, RequestWithParamsBody, Status} from "../types";
import {NextFunction, Response} from "express";
import {commentsRepository} from "../repositories/comments-repository";
import {CommentUpdateModel, CommentViewModel} from "../types/comments";
import {commentsService} from "../services/CommentsService";


class CommentsRouterController implements ICommentsRouterController {

    async getComment(req: RequestWithParams<ParamIdModel>, res: Response<CommentViewModel>, next: NextFunction) {
        const comment : CommentViewModel | null = await commentsRepository.getCommentById(req.params.id);
        if (comment) {
            return res.status(Status.OK).send(comment);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }
    async updateComment(req: RequestWithParamsBody<ParamIdModel, CommentUpdateModel>, res: Response) {
        if (req.userId) {
            const isUserCommentOwner: boolean = await commentsService.isUserCommentOwner(req.params.id, req.userId)
            if (isUserCommentOwner) {
                const isUpdated: boolean = await commentsService.updateCommentById(req.params.id, req.body);
                if (isUpdated) {
                    return res.sendStatus(Status.NO_CONTENT);
                }
            }
            return res.sendStatus(Status.FORBIDDEN);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }
    async deleteComment(req: RequestWithParams<ParamIdModel>, res: Response, next: NextFunction) {
        if (req.userId) {
            const isUserCommentOwner: boolean = await commentsService.isUserCommentOwner(req.params.id, req.userId)
            if (isUserCommentOwner) {
                const isDeleted: boolean = await commentsService.deleteCommentById(req.params.id)
                if (isDeleted) {
                    return res.sendStatus(Status.NO_CONTENT);
                }
            }
            return res.sendStatus(Status.FORBIDDEN);
        }
        return res.sendStatus(Status.NOT_FOUND);
    }
}

export const commentsRouterController = new CommentsRouterController();