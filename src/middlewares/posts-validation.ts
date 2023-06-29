import {withValidator} from "../utils/withValidator";
import {checkSchema} from "express-validator";

export const postsCreationValidator = withValidator(() => {
    return [
        checkSchema({
            shortDescription: {
                in: ['body'],
                isString: {
                    errorMessage: "should be a string",
                },
                isLength: {
                    options: { min: 1, max: 100 },
                    errorMessage: "length should be > 0 < 100"
                },
                trim: true,
            }
        }),
        checkSchema({
            title: {
                in: ['body'],
                isString: {
                    errorMessage: "should be a string",
                },
                isLength: {
                    options: { min: 1, max: 30 },
                    errorMessage: "length should be > 0 < 30"
                },
                trim: true,
            }
        }),
        checkSchema({
            content: {
                in: ['body'],
                isString: {
                    errorMessage: "should be a string",
                },
                isLength: {
                    options: { min: 1, max: 1000 },
                    errorMessage: "length should be > 0 < 1000"
                },
                trim: true,
            }
        }),
        checkSchema({
            blogId: {
                in: ['body'],
                isString: {
                    errorMessage: "should be a string",
                },
                isLength: {
                    options: { min: 1 },
                    errorMessage: "length should be > 0"
                },
                trim: true,
            }
        }),
    ]
})
