import {Blog} from "../blogs";

export type BlogCreateModel = Pick<Blog, 'name' | 'description' | 'websiteUrl'>;

export type BlogUpdateModel = Pick<Blog, 'name' | 'description' | 'websiteUrl'>;