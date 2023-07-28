import {BlogCreateModel, BlogPostCreateModel, BlogUpdateModel, BlogViewModel} from "./blogs";
import {PostsCommentCreateModel, PostsCreateModel, PostsUpdateModel, PostViewModel} from "./posts";
import {UserCreateModel, UserViewModel} from "./users";
import {AuthLoginModel, AuthMeViewModel, AuthToken} from "./login";
import {CommentUpdateModel, CommentViewModel} from "./comments";

export interface IBlogService {
    createBlog(model: BlogCreateModel): Promise<BlogViewModel>
    createPost(blogId: string, model: BlogPostCreateModel): Promise<PostViewModel | null>
    updateBlogById(blogId: string, model: BlogUpdateModel): Promise<boolean>
    deleteBlogById(blogId: string): Promise<boolean>
}

export interface IPostsService {
    createPost(model: PostsCreateModel): Promise<PostViewModel | null>
    updatePostById(blogId: string, model: PostsUpdateModel): Promise<boolean>
    deletePostById(blogId: string): Promise<boolean>
}


export interface IUsersService {
    createUser(model: UserCreateModel): Promise<UserViewModel | null>
    deleteUser(blogId: string): Promise<boolean>
}

export interface IAuthService {
    login(model: AuthLoginModel): Promise<AuthToken | null>
    getAuthUserById(userId: string): Promise<AuthMeViewModel | null>
}

export interface ICommentsService {
    updateCommentById(commentId: string, model: CommentUpdateModel): Promise<boolean>,
    isUserCommentOwner(commentId: string, userId: string): Promise<boolean>,
    deleteCommentById(commentId: string): Promise<boolean>,
    createComment(postId: string, userId: string, model: PostsCommentCreateModel): Promise<CommentViewModel | null>
}
