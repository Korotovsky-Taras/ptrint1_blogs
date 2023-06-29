import {Blog} from "../blogs";

export type BlogViewModel = Pick<Blog, 'name' | 'description' | 'websiteUrl'> & { id: string }