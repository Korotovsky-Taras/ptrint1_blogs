import {
    BlogCreateModel,
    BlogViewModel,
    PostsCommentCreateModel,
    PostsCreateModel,
    PostViewModel,
    UserCreateModel,
    UserViewModel
} from "../src/types";
import supertest from "supertest";
import {app} from "../src/app";
import {createAuthToken} from "../src/utils/authToken";
import {CommentCreateModel, CommentViewModel} from "../src/types/comments";

export const requestApp = supertest(app);
export const authBasic64 = Buffer.from("admin:qwerty").toString("base64");

type BlogCreationTestModel = BlogCreateModel;
type PostCreationTestModel = Omit<PostsCreateModel, 'blogId'>;
type CommentCreationTestModel = PostsCommentCreateModel;
type UserCreationTestModel = UserCreateModel;

export const validBlogData: BlogCreationTestModel = {
    name: "Taras",
    description: "valid",
    websiteUrl: "https://app.by"
}

export const validPostData: PostCreationTestModel = {
    title: "valid title",
    shortDescription: "valid short description",
    content: "valid content",
}

export const validUserData: UserCreationTestModel = {
    login: "taras",
    email: "taras@gmail.com",
    password: "Q12345q"
}

export const validCommentData: CommentCreationTestModel = {
    content: "valid content",
}

export function generateCredentials(length = 8) : {login: string, password: string} {
    // Generate random login and password
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let login = '';
    let password = '';
    for (let i = 0; i < length; i++) {
        login += chars.charAt(Math.floor(Math.random() * chars.length));
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return { login, password };
}


export const createNewUserModel = () : UserCreationTestModel => {
    const {login, password} = generateCredentials();
    return {
        email: `${login}@gmail.com`,
        login,
        password,
    }
}

export const createBlog = async (model: BlogCreationTestModel = validBlogData) : Promise<BlogViewModel> => {
    const result = await requestApp
        .post("/blogs")
        .set('Authorization', 'Basic ' + authBasic64)
        .set('Content-Type', 'application/json')
        .send(model)
    return result.body;
}

export const createPost = async (blogId: string, model: PostCreationTestModel = validPostData) : Promise<PostViewModel> => {
    const result = await requestApp
        .post("/posts")
        .set('Authorization', 'Basic ' + authBasic64)
        .set('Content-Type', 'application/json')
        .send({
            ...model,
            blogId,
        } as PostsCreateModel);
    return result.body;
}

export const createUser = async (model: UserCreateModel) : Promise<UserViewModel> => {
    const result = await requestApp
        .post("/users")
        .set('Authorization', 'Basic ' + authBasic64)
        .set('Content-Type', 'application/json')
        .send({
            ...model,
        } as UserCreateModel);
    return result.body;
}

export const createComment = async (postId: string, userId: string, model: CommentCreationTestModel = validCommentData) : Promise<CommentViewModel> => {
    const result = await requestApp
        .post(`/posts/${postId}/comments`)
        .set('Authorization', 'Bearer ' + createAuthToken(userId))
        .set('Content-Type', 'application/json')
        .send({
            ...model
        } as CommentCreateModel);
    return result.body;
}