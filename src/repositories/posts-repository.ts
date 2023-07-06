import {Post} from "../types";
import {PostsCreateModel, PostsUpdateModel} from "../types/request/posts";
import {blogsRepository} from "./blogs-repository";

const postsDbInstance: Post[] = [];

const createPostsModel = (): Post[] => {
    if (process.env.NODE_ENV !== 'test') {
        return [...postsDbInstance]
    }
    return [...postsDbInstance]
}

const postsModel: Post[] = createPostsModel();

export const postsRepository = {
    async getPosts(): Promise<Post[]> {
        return postsModel;
    },
    async createPost(input: PostsCreateModel): Promise<Post | null> {
        const blog = await blogsRepository.findBlogById(Number(input.blogId))
        if (blog) {
            const newPost: Post = {
                id: String(postsModel.length + 1),
                title: input.title,
                shortDescription: input.shortDescription,
                content: input.content,
                blogId: String(blog.id),
                blogName: blog.name,
            }
            postsModel.push(newPost);
            return newPost;
        }
        return null;
    },
    async findPostById(id: string): Promise<Post | null> {
        return postsModel.find(p => p.id === id) ?? null;
    },
    async updatePostById(id: string, input: PostsUpdateModel): Promise<Post | null> {
        let post = await this.findPostById(id);
        if (post) {
            post.title = input.title;
            post.shortDescription = input.shortDescription;
            post.content = input.content;
            post.blogId = input.blogId;
            return post;
        }
        return null;
    },
    async deletePostById(id: string): Promise<boolean> {
        for (let i = 0; i < postsModel.length; i++) {
            if (postsModel[i].id === id) {
                postsModel.splice(i, 1);
                return true;
            }
        }
        return false;
    },
    async clear(): Promise<void> {
        postsModel.splice(0, postsModel.length)
    }
}