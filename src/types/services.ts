import {BlogCreateModel, BlogPostCreateModel, BlogUpdateModel, BlogViewModel} from "./blogs";
import {PostsCreateModel, PostsUpdateModel, PostViewModel} from "./posts";
import {UserCreateModel, UserViewModel} from "./users";
import {AuthLoginModel} from "./login";

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
    login(model: AuthLoginModel): Promise<boolean>
}
