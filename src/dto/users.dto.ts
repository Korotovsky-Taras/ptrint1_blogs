import {
    UserListMongoModel,
    UserListViewModel,
    UserMongoModel,
    UserNotConfirmedViewModel,
    UserPaginationQueryModel,
    UserPaginationRepositoryModel,
    UserViewModel
} from "../types";
import {
    withExternalDirection,
    withExternalNumber,
    withExternalString,
    withExternalTerm,
} from "../utils/withExternalQuery";

const initialQuery: UserPaginationRepositoryModel = {
    sortBy: "createdAt",
    searchEmailTerm: null,
    searchLoginTerm: null,
    sortDirection: "desc",
    pageNumber: 1,
    pageSize: 10
}

export const UsersDto = {
    allUsers(list: UserListMongoModel): UserListViewModel {
        return {
            pagesCount: list.pagesCount,
            page: list.page,
            pageSize: list.pageSize,
            totalCount: list.totalCount,
            items: list.items.map(UsersDto.user)
        }
    },
    user({_id, login, email, createdAt}: UserMongoModel): UserViewModel {
        return {
            id: _id.toString(),
            login,
            email,
            createdAt,
        }
    },
    userNotConfirmed(userModel: UserMongoModel): UserNotConfirmedViewModel {
        return {
            ...UsersDto.user(userModel),
            emailConfirmation: userModel.emailConfirmation,
        }
    },
    toRepoQuery(query: UserPaginationQueryModel): UserPaginationRepositoryModel {
        return {
            searchLoginTerm: withExternalTerm(initialQuery.searchLoginTerm, query.searchLoginTerm),
            searchEmailTerm: withExternalTerm(initialQuery.searchEmailTerm, query.searchEmailTerm),
            sortBy: withExternalString(initialQuery.sortBy, query.sortBy),
            sortDirection: withExternalDirection(initialQuery.sortDirection, query.sortDirection),
            pageNumber: withExternalNumber(initialQuery.pageNumber, query.pageNumber),
            pageSize: withExternalNumber(initialQuery.pageSize, query.pageSize)
        };
    },
}