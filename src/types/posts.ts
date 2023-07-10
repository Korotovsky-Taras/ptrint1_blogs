import {WithId} from "mongodb";

export type Post = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
}

export type PostMongoModel = WithId<Post>

export type PostsCreateModel = Pick<Post, 'title' | 'shortDescription' | 'content' | 'blogId'>;

export type PostsUpdateModel = Pick<Post, 'title' | 'shortDescription' | 'content' | 'blogId'>;

export type PostViewModel = Pick<Post, 'title' | 'shortDescription' | 'content' | 'blogId' | 'blogName' | 'createdAt'> & {id: string}
