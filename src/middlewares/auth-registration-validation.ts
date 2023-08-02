import {withValidator} from "../utils/withValidator";
import {checkSchema} from "express-validator";
import {usersRepository} from "../repositories/users-repository";
import {userCreateValidation} from "./user-create-validation";


export const authRegistrationValidation = withValidator(() => {
    return [
        ...userCreateValidation,
        checkSchema({
            email: {
                in: ['body'],
                trim: true,
                custom: {
                    options: async (email) => {
                        const res = await usersRepository.getUserByEmail(email);
                        if (res != null) {
                            throw Error("email already in use")
                        }
                    },
                },
            }
        }),
    ]
})

export const authEmailValidation = withValidator(() => {
    return [
        checkSchema({
            email: {
                in: ['body'],
                trim: true,
                isString: {
                    errorMessage: "should be a string",
                },
                matches: {
                    options: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    errorMessage: "should match email pattern"
                },
            }
        }),
    ]
})

export const authCodeValidation = withValidator(() => {
    return [
        checkSchema({
            code: {
                in: ['body'],
                trim: true,
                isLength: {
                    options: { min: 1 },
                    errorMessage: "code should not be empty"
                },
            }
        }),
    ]
})
