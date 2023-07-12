import {
    PaginationQueryModel,
    PostMongoModel,
    PostPaginationRepositoryModel,
    PostsListMongoModel,
    PostsListViewModel,
    PostViewModel,
    QueryGateModel
} from "../types";
import {withExternalDirection, withExternalNumber, withExternalString,} from "../utils/withExternalQuery";

const initialQuery: QueryGateModel<PaginationQueryModel, PostPaginationRepositoryModel> = {
    sortBy: "createdAt",
    sortDirection: "asc",
    pageNumber: 1,
    pageSize: 10
}

export const PostsDto = {
    allPosts(list: PostsListMongoModel): PostsListViewModel {
        return {
            pagesCount: list.pagesCount,
            page: list.page,
            pageSize: list.pageSize,
            totalCount: list.totalCount,
            items: list.items.map(this.post)
        }
    },
    toRepoQuery(query: PaginationQueryModel): PostPaginationRepositoryModel {
        return {
            sortBy: withExternalString(initialQuery.sortBy, query.sortBy),
            sortDirection: withExternalDirection(initialQuery.sortDirection, query.sortDirection),
            pageNumber: withExternalNumber(initialQuery.pageNumber, query.pageNumber),
            pageSize: withExternalNumber(initialQuery.pageSize, query.pageSize)
        };
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
