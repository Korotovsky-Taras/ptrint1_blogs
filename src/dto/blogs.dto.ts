import {Blog, BlogViewModel} from "../types";

export const BlogsDto = {
    allBlogs(blogs: Blog[]): BlogViewModel[] {
        return blogs.map(this.blog)
    },
    blog({id, name, description, websiteUrl}: Blog): BlogViewModel {
        return {
            id: String(id),
            name,
            description,
            websiteUrl
        }
    }
}