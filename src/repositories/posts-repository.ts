import {BlogViewModel, Post, PostMongoModel, PostsCreateModel, PostsUpdateModel, PostViewModel} from "../types";
import {blogsRepository} from "./blogs-repository";
import {withMongoLogger} from "../utils/withMongoLogger";
import {postsCollection} from "../db";
import {ObjectId} from "mongodb";
import {PostsDto} from "../dto/posts.dto";

export const postsRepository = {
    async getPosts(): Promise<PostViewModel[]> {
        return withMongoLogger<PostViewModel[]>(async () => {
            const posts: PostMongoModel[] = await postsCollection.find({}).toArray();
            return PostsDto.allPosts(posts);
        });
    },
    async createPost(input: PostsCreateModel): Promise<PostViewModel | null> {
        return withMongoLogger<PostViewModel | null>(async () => {
            const blog: BlogViewModel | null = await blogsRepository.findBlogById(input.blogId)
            if (blog) {
                const newPost: Post = {
                    title: input.title,
                    shortDescription: input.shortDescription,
                    content: input.content,
                    blogId: blog.id,
                    blogName: blog.name,
                    createdAt: (new Date()).toISOString(),
                }
                const res = await postsCollection.insertOne(newPost);
                return PostsDto.post({
                    _id: res.insertedId,
                    ...newPost,
                });
            }
            return null;
        });
    },
    async findPostById(id: string): Promise<PostViewModel | null> {
        return withMongoLogger<PostViewModel | null>(async () => {
            const post: PostMongoModel | null = await postsCollection.findOne({_id: new ObjectId(id)});
            return post ? PostsDto.post(post) : null;
        })
    },
    async updatePostById(id: string, input: PostsUpdateModel): Promise<boolean> {
        return withMongoLogger<boolean>(async () => {
            const result = await postsCollection.updateOne({_id: new ObjectId(id)}, {$set: input});
            return result.matchedCount === 1;
        })
    },
    async deletePostById(id: string): Promise<boolean> {
        return withMongoLogger<boolean>(async () => {
            const result = await postsCollection.deleteOne({_id: new ObjectId(id)});
            return result.deletedCount === 1;
        })
    },
    async clear(): Promise<void> {
        return withMongoLogger<void>(async () => {
            await postsCollection.deleteMany({});
        })
    }
}