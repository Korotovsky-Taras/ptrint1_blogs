import {Blog, BlogViewModel} from "../types";

export const BlogsDto = {
    allBlogs(blogs: Blog[]): BlogViewModel[] {
        return blogs.map(this.blog)
    },
    blog({id, name, description, websiteUrl, createdAt, isMembership}: Blog): BlogViewModel {
        return {
            id,
            name,
            description,
            websiteUrl,
            createdAt,
            isMembership,
        }
    }
}