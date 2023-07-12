import {
    PaginationQueryModel,
    PostMongoModel,
    PostPaginationRepositoryModel,
    PostsListMongoModel,
    PostsListViewModel,
    PostViewModel,
    QueryGateModel
} from "../types";
import {withExternalValue} from "../utils/withExternalValue";

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
            sortBy: withExternalValue(initialQuery.sortBy, query.sortBy),
            sortDirection: withExternalValue(initialQuery.sortDirection, query.sortDirection),
            pageNumber: withExternalValue(initialQuery.pageNumber, Number(query.pageNumber)),
            pageSize: withExternalValue(initialQuery.pageSize, Number(query.pageSize))
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
