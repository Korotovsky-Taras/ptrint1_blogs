import {Blog, Post} from "../types";
import {PostsCreateModel, PostsUpdateModel} from "../types/request/posts";
import {blogsRepository} from "./blogs-repository";
import {withMongoLogger} from "../utils/withMongoLogger";
import {postsCollection} from "../db";

export const postsRepository = {
    async getPosts(): Promise<Post[]> {
        return withMongoLogger<Post[]>(async () => {
            return postsCollection.find({}).toArray();
        });
    },
    async createPost(input: PostsCreateModel): Promise<Post | null> {
        return withMongoLogger<Post| null>(async () => {
            const blog: Blog | null = await blogsRepository.findBlogById(Number(input.blogId))
            if (blog) {
                const collectionCount: number = await postsCollection.countDocuments()
                const newPost: Post = {
                    id: String(collectionCount + 1),
                    title: input.title,
                    shortDescription: input.shortDescription,
                    content: input.content,
                    blogId: String(blog.id),
                    blogName: blog.name,
                    createdAt: (new Date()).toISOString(),
                    isMembership: false,
                }
                await postsCollection.insertOne(newPost);
                return newPost;
            }
            return null;
        });
    },
    async findPostById(id: string): Promise<Post | null> {
        return withMongoLogger<Post | null>(async () => {
            return await postsCollection.findOne({id: id});
        })
    },
    async updatePostById(id: string, input: PostsUpdateModel): Promise<boolean> {
        return withMongoLogger<boolean>(async () => {
            const result = await postsCollection.updateOne({id: id}, {$set: input});
            return result.matchedCount === 1;
        })
    },
    async deletePostById(id: string): Promise<boolean> {
        return withMongoLogger<boolean>(async () => {
            const result = await postsCollection.deleteOne({id: id});
            return result.deletedCount === 1;
        })
    },
    async clear(): Promise<void> {
        return withMongoLogger<void>(async () => {
            await postsCollection.deleteMany({});
        })
    }
}