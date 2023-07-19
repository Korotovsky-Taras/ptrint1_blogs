import {withMongoLogger} from "../utils/withMongoLogger";
import {User, UserListViewModel, UserPaginationRepositoryModel, UserViewModel} from "../types";
import {usersCollection} from "../db";
import {UsersDto} from "../dto/users.dto";
import {withMongoQueryFilterPagination} from "./utils";

export const usersRepository = {
    async getAll(query: UserPaginationRepositoryModel): Promise<UserListViewModel> {
        return withMongoLogger<UserListViewModel>(async () => {

            let filter: any = {};
            if (query.searchEmailTerm != null) {
                filter.email = {$regex: query.searchEmailTerm, $options: "i" }
            }
            if (query.searchLoginTerm != null) {
                filter.login = {$regex: query.searchLoginTerm, $options: "i" }
            }

            return withMongoQueryFilterPagination<User, UserViewModel>(usersCollection, UsersDto.allUsers, filter, query);
        });
    }
}