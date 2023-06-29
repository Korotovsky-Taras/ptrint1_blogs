import {withValidator} from "../utils/withValidator";
import {checkSchema} from "express-validator";

export const blogsCreationValidator = withValidator(() => {
    return [
        checkSchema({
            name: {
                in: ['body'],
                isString: {
                    errorMessage: "should be a string",
                },
                isLength: {
                    options: { min: 1, max: 15 },
                    errorMessage: "length should be > 0 < 15"
                },
                trim: true,
            }
        }),
        checkSchema({
            description: {
                in: ['body'],
                isString: {
                    errorMessage: "should be a string",
                },
                isLength: {
                    options: { min: 1, max: 500 },
                    errorMessage: "length should be > 0 < 500"
                },
                trim: true,
            }
        }),
        checkSchema({
            websiteUrl: {
                in: ['body'],
                isString: {
                    errorMessage: "should be a string",
                },
                isLength: {
                    options: { min: 1, max: 100 },
                    errorMessage: "length should be > 0 < 100"
                },
                matches: {
                    options: /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
                    errorMessage: "should match pattern 'https://'"
                },
                trim: true,
            }
        }),
    ]
})