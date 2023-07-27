import {ICommentsService, PostsCommentCreateModel, PostViewModel} from "../types";
import {postsRepository} from "../repositories";
import {CommentUpdateModel, CommentViewModel} from "../types/comments";
import {usersRepository} from "../repositories/users-repository";
import {AuthMeViewModel} from "../types/login";
import {commentsRepository} from "../repositories/comments-repository";

class CommentsService implements ICommentsService {
    async updateCommentById(commentId: string, model: CommentUpdateModel): Promise<boolean> {
        return commentsRepository.updateCommentById(commentId, model)
    }
    async deleteCommentById(commentId: string): Promise<boolean> {
        return commentsRepository.deleteCommentById(commentId)
    }
    async createComment(postId: string, userId: string, model: PostsCommentCreateModel): Promise<CommentViewModel | null> {
        const user: AuthMeViewModel | null = await usersRepository.getAuthUserById(userId);
        const post: PostViewModel | null = await postsRepository.findPostById(postId);
        if (user && post) {
            return commentsRepository.createComment({
                userLogin: user.login,
                userId: user.userId,
                content: model.content
            });
        }
        return null;
    }
}

export const commentsService = new CommentsService();
