import {EnhancedOmit, WithId} from "mongodb";
import {PaginationQueryModel, WithPagination, WithPaginationQuery} from "./custom";


export type User = {
    login: string,
    email: string,
    password: UserEncodedPassword,
    createdAt: string,
    emailConfirmation: UserEmailConfirmation | null,
}

export type WithUserId = {
    userId: string,
}

export type UserEncodedPassword = {
    salt: string,
    hash: string
}

export type UserEmailConfirmation = {
    expiresIn: string,
    code: string,
    confirmed: boolean,
}

export type UserMongoModel = WithId<User>

export type UserCreateModel = Pick<User, 'login' | 'email' > & {password: string};

export type UserViewModel = Pick<User, 'login' | 'email' | 'createdAt'> & { id: string }

export type UserWithConfirmedViewModel = Pick<User, 'login' | 'email' | 'createdAt' | 'emailConfirmation'> & { id: string }

export type UserListMongoModel = WithPagination<UserMongoModel>

export type UserListViewModel = WithPagination<UserViewModel>

export type UserReplaceConfirmationData = Pick<User, 'email'> & { code: string }

export type UserPaginationQueryModel = PaginationQueryModel<User> & {
    searchLoginTerm?: string,
    searchEmailTerm?: string
}

export type UserPaginationRepositoryModel = EnhancedOmit<WithPaginationQuery<User>, "searchLoginTerm" | "searchEmailTerm"> & {
    searchLoginTerm: string | null,
    searchEmailTerm: string | null,
}
