import {withValidator} from "../utils/withValidator";
import {checkSchema} from "express-validator";
import {blogsRepository} from "../repositories";

export const postsUpdateValidator = withValidator(() => {
    return [
        checkSchema({
            blogId: {
                in: ['body'],
                isNumeric: {
                    options: {
                        no_symbols: true,
                    },
                },
            }
        }),
        checkSchema({
            shortDescription: {
                in: ['body'],
                trim: true,
                isString: {
                    errorMessage: "should be a string",
                },
                isLength: {
                    options: { min: 1, max: 100 },
                    errorMessage: "length should be > 0 < 100"
                },
            }
        }),
        checkSchema({
            title: {
                in: ['body'],
                trim: true,
                isString: {
                    errorMessage: "should be a string",
                },
                isLength: {
                    options: { min: 1, max: 30 },
                    errorMessage: "length should be > 0 < 30"
                },
            }
        }),
        checkSchema({
            content: {
                in: ['body'],
                trim: true,
                isString: {
                    errorMessage: "should be a string",
                },
                isLength: {
                    options: { min: 1, max: 1000 },
                    errorMessage: "length should be > 0 < 1000"
                },
            }
        }),
        checkSchema({
            blogId: {
                in: ['body'],
                trim: true,
                isString: {
                    errorMessage: "should be a string",
                },
                isLength: {
                    options: { min: 1 },
                    errorMessage: "length should be > 0"
                },
            }
        }),
    ]
})

export const postsCreationValidator = withValidator(() => {
    return [
        ...postsUpdateValidator,
        checkSchema({
            blogId: {
                in: ['body'],
                custom: {
                    options: (blogId) => blogsRepository.findBlogById(Number(blogId)),
                    errorMessage: "wrong id",
                },
            }
        }),
    ]
})
