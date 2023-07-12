import {
    BlogListMongoModel,
    BlogListViewModel,
    BlogMongoModel,
    BlogPaginationRepositoryModel,
    BlogViewModel,
    PaginationQueryModel,
    QueryGateModel
} from "../types";
import {withExternalValue} from "../utils/withExternalValue";

const initialQuery: QueryGateModel<PaginationQueryModel, BlogPaginationRepositoryModel> = {
    sortBy: "createdAt",
    searchNameTerm: null,
    sortDirection: "asc",
    pageNumber: 1,
    pageSize: 10
}

export const BlogsDto = {
    allBlogs(list: BlogListMongoModel): BlogListViewModel {
        return {
            pagesCount: list.pagesCount,
            page: list.page,
            pageSize: list.pageSize,
            totalCount: list.totalCount,
            items: list.items.map(this.blog)
        }
    },
    blog({_id, name, description, websiteUrl, createdAt, isMembership}: BlogMongoModel): BlogViewModel {
        return {
            id: _id.toString(),
            name,
            description,
            websiteUrl,
            createdAt,
            isMembership,
        }
    },
    toRepoQuery(query: PaginationQueryModel): BlogPaginationRepositoryModel {
        return {
            sortBy: withExternalValue(initialQuery.sortBy, query.sortBy),
            searchNameTerm: withExternalValue(initialQuery.searchNameTerm, query.searchNameTerm),
            sortDirection: withExternalValue(initialQuery.sortDirection, query.sortDirection),
            pageNumber: withExternalValue(initialQuery.pageNumber, Number(query.pageNumber)),
            pageSize: withExternalValue(initialQuery.pageSize, Number(query.pageSize))
        };
    },
}