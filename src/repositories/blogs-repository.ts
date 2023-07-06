import {Blog, BlogCreateModel, BlogUpdateModel} from "../types";
import {blogsCollection} from "../db";


export const blogsRepository = {
    async getBlogs(): Promise<Blog[]> {
        return blogsCollection.find({}).toArray();
    },
    async createBlog(input: BlogCreateModel): Promise<Blog> {
        const collectionCount: number = await blogsCollection.countDocuments()
        const newBlog: Blog = {
            id: collectionCount + 1,
            ...input,
        }
        await blogsCollection.insertOne(newBlog);
        return newBlog;
    },
    async findBlogById(id: number): Promise<Blog | null> {
        return await blogsCollection.findOne({id: id});
    },
    async updateBlogById(id: number, input: BlogUpdateModel): Promise<boolean> {
        try {
            const result = await blogsCollection.updateOne({id: id}, {$set: input});
            return result.matchedCount === 1;
        } catch (e) {
            console.log(e)
            return false;
        }
    },
    async deleteBlogById(id: number): Promise<boolean> {
        const result = await blogsCollection.deleteOne({id: id});
        return result.deletedCount === 1;
    },
    async clear(): Promise<void> {
        await blogsCollection.deleteMany({});
    }
}