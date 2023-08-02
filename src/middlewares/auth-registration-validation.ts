import {withValidator} from "../utils/withValidator";
import {checkSchema} from "express-validator";

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
