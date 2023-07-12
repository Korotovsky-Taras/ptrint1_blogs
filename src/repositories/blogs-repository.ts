import {
    Blog,
    BlogCreateModel,
    BlogListViewModel,
    BlogMongoModel,
    BlogPaginationRepositoryModel,
    BlogUpdateModel,
    BlogViewModel,
    PostsListViewModel
} from "../types";
import {blogsCollection} from "../db";
import {withMongoLogger} from "../utils/withMongoLogger";
import {ObjectId} from "mongodb";
import {BlogsDto} from "../dto/blogs.dto";
import {postsRepository} from "./posts-repository";


export const blogsRepository = {
    async getBlogs(query: BlogPaginationRepositoryModel): Promise<BlogListViewModel> {
        return withMongoLogger<BlogListViewModel>(async () => {

            let filter: any = {};
            if (query.searchNameTerm != null) {
                filter.name = {$regex: query.searchNameTerm, $options: "i" }
            }

            const items: BlogMongoModel[] = await blogsCollection.find(filter)
                .sort(query.sortBy, query.sortDirection)
                .skip(Math.max(query.pageNumber - 1, 0) * query.pageSize)
                .limit(query.pageSize)
                .toArray();

            const totalCount: number = items.length;

            return BlogsDto.allBlogs({
                pagesCount: Math.ceil(totalCount/query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount,
                items,
            });
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
    async findBlogPosts(id: string, query: BlogPaginationRepositoryModel): Promise<PostsListViewModel | null> {
        return withMongoLogger<PostsListViewModel | null>(async () => {
            const blog: BlogMongoModel | null = await blogsCollection.findOne({_id: new ObjectId(id)})
            if (blog) {
                const model: PostsListViewModel = await postsRepository.getPosts({blogId: id}, query);
                return model;
            }
            return null;
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