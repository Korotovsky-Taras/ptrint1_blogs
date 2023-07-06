import {Post} from "../posts";

export type PostViewModel = Pick<Post, 'id' | 'title' | 'shortDescription' | 'content' | 'blogId' | 'blogName' | 'createdAt'>