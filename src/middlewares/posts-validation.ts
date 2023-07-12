import {withValidator} from "../utils/withValidator";
import {checkSchema} from "express-validator";
import {blogsRepository} from "../repositories";

export const postCreationValidator = withValidator(() => {
    return [
        checkSchema({
            shortDescription: {
                in: ['body'],
                trim: true,
                isString: {
                    errorMessage: "should be a string",
                },
                isLength: {
                    options: {min: 1, max: 100},
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
                    options: {min: 1, max: 30},
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
                    options: {min: 1, max: 1000},
                    errorMessage: "length should be > 0 < 1000"
                },
            }
        })
    ]
})
export const postUpdateWithIdValidator = withValidator(() => {
    return [
        ...postCreationValidator,
        checkSchema({
            blogId: {
                in: ['body'],
                trim: true,
                isString: {
                    errorMessage: "should be a string",
                },
                isLength: {
                    options: {min: 1},
                    errorMessage: "length should be > 0"
                },
            }
        }),
    ]
})

export const postCreationWithIdValidator = withValidator(() => {
    return [
        ...postUpdateWithIdValidator,
        checkSchema({
            blogId: {
                in: ['body'],
                custom: {
                    options: (blogId) => blogsRepository.findBlogById(blogId),
                    errorMessage: "wrong id",
                },
            }
        }),
    ]
})
