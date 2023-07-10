import {BlogMongoModel, BlogViewModel} from "../types";

export const BlogsDto = {
    allBlogs(blogs: BlogMongoModel[]): BlogViewModel[] {
        return blogs.map(this.blog)
    },
    blog({_id, name, description, websiteUrl, createdAt, isMembership}: BlogMongoModel): BlogViewModel {
        return {
            id: _id.toString(),
            name,
            description,
            websiteUrl,
            createdAt,
            isMembership,
        }
    }
}