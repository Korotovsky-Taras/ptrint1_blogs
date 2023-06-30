import {withValidator} from "../utils/withValidator";
import {checkSchema} from "express-validator";
import {blogsRepository} from "../repositories";

export const postsUpdateValidator = withValidator(() => {
    return [
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
        checkSchema({
            blogId: {
                in: ['body'],
                isNumeric: {
                    options: {
                        no_symbols: true,
                    },
                },
                custom: {
                    options: (blogId) => blogsRepository.findBlogById(Number(blogId)),
                    errorMessage: "wrong id",
                },
            }
        }),
        ...postsUpdateValidator,
    ]
})

console.log(blogsRepository.findBlogById(Number("602afe92-7d97-4395-b1b9-6cf98b351bbe")), Number("602afe92-7d97-4395-b1b9-6cf98b351bbe"))
