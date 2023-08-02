import {withValidator} from "../utils/withValidator";
import {checkSchema} from "express-validator";
import {usersRepository} from "../repositories/users-repository";


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

export const authLoginInUseValidation = withValidator(() => {
    return [
        checkSchema({
            login: {
                in: ['body'],
                trim: true,
                custom: {
                    options: async (login) => {
                        const res = await usersRepository.getUserByLogin(login);
                        if (res != null) {
                            throw Error("login already in use")
                        }
                    },
                },
            }
        }),
    ]
})

export const authEmailInUseValidation = withValidator(() => {
    return [
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
                custom: {
                    options: async (code) => {
                        const res = await usersRepository.getUserByConfirmationCode(code);
                        if (res === null) {
                            throw Error("code is not valid")
                        }
                    },
                },
            }
        }),
    ]
})
