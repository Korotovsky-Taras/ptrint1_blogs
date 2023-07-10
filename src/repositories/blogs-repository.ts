import {Blog, BlogCreateModel, BlogMongoModel, BlogUpdateModel, BlogViewModel} from "../types";
import {blogsCollection} from "../db";
import {withMongoLogger} from "../utils/withMongoLogger";
import {ObjectId} from "mongodb";
import {BlogsDto} from "../dto/blogs.dto";


export const blogsRepository = {
    async getBlogs(): Promise<BlogViewModel[]> {
        return withMongoLogger<BlogViewModel[]>(async () => {
            const blogs: BlogMongoModel[] = await blogsCollection.find({}).toArray();
            return BlogsDto.allBlogs(blogs);
        })
    },
    async createBlog(input: BlogCreateModel): Promise<BlogViewModel> {
        return withMongoLogger<BlogViewModel>(async () => {
            const newBlog: Blog = {
                ...input,
                createdAt: (new Date()).toISOString(),
                isMembership: false,
            }
            const res = await blogsCollection.insertOne(newBlog);
            return BlogsDto.blog({
                _id: res.insertedId,
                ...newBlog,
            });
        })
    },
    async findBlogById(id: string): Promise<BlogViewModel | null> {
        return withMongoLogger<BlogViewModel | null>(async () => {
            const blog: BlogMongoModel | null = await blogsCollection.findOne({_id: new ObjectId(id)})
            return blog ? BlogsDto.blog(blog) : null;
        })
    },
    async updateBlogById(id: string, input: BlogUpdateModel): Promise<boolean> {
        return withMongoLogger<boolean>(async () => {
            const result = await blogsCollection.updateOne({_id: new ObjectId(id)}, { $set : input});
            return result.matchedCount === 1;
        })
    },
    async deleteBlogById(id: string): Promise<boolean> {
        return withMongoLogger<boolean>(async () => {
            const result = await blogsCollection.deleteOne({_id: new ObjectId(id)});
            return result.deletedCount === 1;
        })
    },
    async clear(): Promise<void> {
        return withMongoLogger<void>(async () => {
            await blogsCollection.deleteMany({});
        })
    }
}