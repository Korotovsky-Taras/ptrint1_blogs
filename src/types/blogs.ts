import {WithId} from "mongodb";

export type Blog = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean,
}

export type BlogMongoModel = WithId<Blog>

export type BlogCreateModel = Pick<Blog, 'name' | 'description' | 'websiteUrl'>;

export type BlogUpdateModel = Pick<Blog, 'name' | 'description' | 'websiteUrl'>;

export type BlogViewModel = Pick<Blog, 'name' | 'description' | 'websiteUrl' | 'isMembership' | 'createdAt'> & { id: string}

