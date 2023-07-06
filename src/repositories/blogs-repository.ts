import {Blog, BlogCreateModel, BlogUpdateModel} from "../types";
import {blogsCollection} from "../db";
import {withMongoLogger} from "../utils/withMongoLogger";


export const blogsRepository = {
    async getBlogs(): Promise<Blog[]> {
        return withMongoLogger<Blog[]>(async () => {
            return blogsCollection.find({}).toArray();
        })
    },
    async createBlog(input: BlogCreateModel): Promise<Blog> {
        return withMongoLogger<Blog>(async () => {
            const collectionCount: number = await blogsCollection.countDocuments()
            const newBlog: Blog = {
                id: collectionCount + 1,
                ...input,
                createdAt: (new Date()).toISOString(),
                isMembership: false,
            }
            await blogsCollection.insertOne(newBlog);
            return newBlog;
        })
    },
    async findBlogById(id: number): Promise<Blog | null> {
        return withMongoLogger<Blog | null>(async () => {
            return await blogsCollection.findOne({id: id});
        })
    },
    async updateBlogById(id: number, input: BlogUpdateModel): Promise<boolean> {
        return withMongoLogger<boolean>(async () => {
            const result = await blogsCollection.updateOne({id: id}, {$set: input});
            return result.matchedCount === 1;
        })
    },
    async deleteBlogById(id: number): Promise<boolean> {
        return withMongoLogger<boolean>(async () => {
            const result = await blogsCollection.deleteOne({id: id});
            return result.deletedCount === 1;
        })
    },
    async clear(): Promise<void> {
        return withMongoLogger<void>(async () => {
            await blogsCollection.deleteMany({});
        })
    }
}