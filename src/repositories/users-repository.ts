import {withMongoLogger} from "../utils/withMongoLogger";
import {
    User,
    UserCreateModel,
    UserEncodedPassword,
    UserListViewModel,
    UserMongoModel,
    UserPaginationRepositoryModel,
    UserViewModel
} from "../types";
import {usersCollection} from "../db";
import {UsersDto} from "../dto/users.dto";
import {withMongoQueryFilterPagination} from "./utils";
import crypto from "node:crypto";
import {AuthLoginModel, AuthMeViewModel} from "../types/login";
import {Filter, ObjectId} from "mongodb";
import {AuthDto} from "../dto/auth.dto";

export const usersRepository = {
    async getAll(query: UserPaginationRepositoryModel): Promise<UserListViewModel> {
        return withMongoLogger<UserListViewModel>(async () => {

            let filter: Filter<User> = {};

            const searchLoginTermFilter: Filter<User> | null = query.searchLoginTerm !== null ? {login: {$regex: query.searchLoginTerm, $options: "i" }} : null;
            const searchEmailTermFilter: Filter<User> | null = query.searchEmailTerm !== null ? {email: {$regex: query.searchEmailTerm, $options: "i" }} : null;

            if (searchLoginTermFilter && searchEmailTermFilter) {
                filter = {$or: [searchEmailTermFilter, searchLoginTermFilter]}
            } else if (searchLoginTermFilter) {
                filter = searchLoginTermFilter
            } else if (searchEmailTermFilter) {
                filter = searchEmailTermFilter
            }

            return withMongoQueryFilterPagination<User, UserViewModel>(usersCollection, UsersDto.allUsers, filter, query);
        });
    },
    async createUser(model: UserCreateModel): Promise<UserViewModel | null> {
        return withMongoLogger<UserViewModel | null>(async () => {

            const userExist: UserMongoModel | null = await usersCollection.findOne({$or: [{email: model.email}, {login: model.login}]});

            if (userExist) {
                return null;
            }

            const newUser: User = {
                email: model.email,
                login: model.login,
                password: usersRepository._hashPassword(model.password),
                createdAt: (new Date()).toISOString(),
            }

            const user = await usersCollection.insertOne(newUser)

            return UsersDto.user({
                _id: user.insertedId,
                ...newUser,
            })
        })
    },
    async deleteUserById(userId: string): Promise<boolean> {
        return withMongoLogger<boolean>(async () => {
            const result = await usersCollection.deleteOne({_id: new ObjectId(userId)});
            return result.deletedCount === 1;
        });
    },
    async checkUserAuth(model: AuthLoginModel): Promise<boolean> {
        return withMongoLogger<boolean>(async () => {
            const user: UserMongoModel | null = await usersCollection.findOne({$or: [{email: model.loginOrEmail}, {login: model.loginOrEmail}]})
            if (user) {
                return usersRepository._verifyPassword(model.password, user.password.salt, user.password.hash)
            }
            return false;
        });
    },
    async getAuthUserById(userId: string): Promise<AuthMeViewModel | null> {
        return withMongoLogger<AuthMeViewModel | null>(async () => {
            const user: UserMongoModel | null = await usersCollection.findOne({_id: new ObjectId(userId)})
            if (user) {
                return AuthDto.user(user)
            }
            return null;
        });
    },
    async clear(): Promise<void> {
        return withMongoLogger<void>(async () => {
            await usersCollection.deleteMany({});
        })
    },
    _hashPassword(password: string) : UserEncodedPassword {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = usersRepository._createPasswordHash(password, salt);
        return { salt, hash };
    },
    _verifyPassword(password: string, salt: string, hash: string): boolean {
        const newHash = usersRepository._createPasswordHash(password, salt);
        return newHash === hash;
    },
    _createPasswordHash(password: string, salt: string): string {
        return crypto.pbkdf2Sync(password, salt, 100, 24, 'sha512').toString('hex');
    },
}