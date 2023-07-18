import {
    BlogViewModel,
    Post,
    PostMongoModel,
    PostPaginationRepositoryModel,
    PostsCreateModel,
    PostsListViewModel,
    PostsUpdateModel,
    PostViewModel
} from "../types";
import {withMongoLogger} from "../utils/withMongoLogger";
import {postsCollection} from "../db";
import {ObjectId} from "mongodb";
import {PostsDto} from "../dto/posts.dto";

export const postsRepository = {
    async getPosts(filter: Partial<PostMongoModel>, query: PostPaginationRepositoryModel): Promise<PostsListViewModel> {
        return withMongoLogger<PostsListViewModel>(async () => {


            const totalCount: number = await postsCollection.countDocuments(filter)

            const items: PostMongoModel[] = await postsCollection.find(filter)
                .sort(query.sortBy, query.sortDirection)
                .skip(Math.max(query.pageNumber - 1, 0) * query.pageSize)
                .limit(query.pageSize)
                .toArray();


            return PostsDto.allPosts({
                pagesCount: Math.ceil(totalCount/query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount,
                items,
            });
        });
    },
    async createPost(input: PostsCreateModel, blog: BlogViewModel): Promise<PostViewModel> {
        return withMongoLogger<PostViewModel>(async () => {
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