import {PostMongoModel, PostViewModel} from "../types";

export const PostsDto = {
    allPosts(blogs: PostMongoModel[]): PostViewModel[] {
        return blogs.map(this.post)
    },
    post({ _id, title, shortDescription, content, blogId, blogName, createdAt }: PostMongoModel): PostViewModel {
        return {
            id: _id.toString(),
            title,
            shortDescription,
            content,
            blogId,
            blogName,
            createdAt,
        }
    }
}
