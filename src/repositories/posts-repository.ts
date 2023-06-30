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
    getPosts(): Post[] {
        return postsModel;
    },
    createPost(input: PostsCreateModel): Post | null {
        const blog = blogsRepository.findBlogById(Number(input.blogId))
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
    findPostById(id: string): Post | null {
        return postsModel.find(p => p.id === id) ?? null;
    },
    updatePostById(id: string, input: PostsUpdateModel): Post | null {
        let post = this.findPostById(id);
        if (post) {
            post.title = input.title;
            post.shortDescription = input.shortDescription;
            post.content = input.content;
            post.blogId = input.blogId;
            return post;
        }
        return null;
    },
    deletePostById(id: string): boolean {
        for (let i = 0; i < postsModel.length; i++) {
            if (postsModel[i].id === id) {
                postsModel.splice(i, 1);
                return true;
            }
        }
        return false;
    },
    clear(): void {
        postsModel.splice(0, postsModel.length)
    }
}