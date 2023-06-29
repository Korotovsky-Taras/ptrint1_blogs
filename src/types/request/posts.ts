import {Post} from "../posts";

export type PostsCreateModel = Pick<Post, 'title' | 'shortDescription' | 'content' | 'blogId'>;

export type PostsUpdateModel = Pick<Post, 'title' | 'shortDescription' | 'content' | 'blogId'>;