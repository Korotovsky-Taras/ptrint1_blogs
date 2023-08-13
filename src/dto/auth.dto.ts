import {UserMongoModel} from "../types";
import {AuthMeViewModel} from "../types/login";

export const AuthDto = {
    user({_id, email, login}: UserMongoModel): AuthMeViewModel {
        return {
            email: email,
            login: login,
            userId: _id.toString(),
        }
    },
}