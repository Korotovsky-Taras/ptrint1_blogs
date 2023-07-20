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
import {AuthLoginModel} from "../types/login";
import {ObjectId} from "mongodb";

export const usersRepository = {
    async getAll(query: UserPaginationRepositoryModel): Promise<UserListViewModel> {
        return withMongoLogger<UserListViewModel>(async () => {

            let filter: any = {};
            const searchLoginTermFilter = {login: {$regex: query.searchLoginTerm, $options: "i" }};
            const searchEmailTermFilter = {email: {$regex: query.searchEmailTerm, $options: "i" }};
            if (query.searchEmailTerm != null && query.searchLoginTerm != null) {
                filter = {$or: [searchEmailTermFilter, searchLoginTermFilter]}
            } else if (query.searchLoginTerm != null) {
                filter = searchLoginTermFilter
            } else if (query.searchEmailTerm != null) {
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