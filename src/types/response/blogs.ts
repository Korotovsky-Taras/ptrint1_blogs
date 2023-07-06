import {Blog} from "../blogs";

export type BlogViewModel = Pick<Blog, 'id' | 'name' | 'description' | 'websiteUrl' | 'isMembership' | 'createdAt'>