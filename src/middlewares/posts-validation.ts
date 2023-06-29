import {withValidator} from "../utils/withValidator";
import {body} from "express-validator";

export const postsCreationValidator = withValidator(() => {
    return [
        body("title")
            .isString().withMessage("title should be a string")
            .trim()
            .isLength({min: 1}).withMessage("title should not be empty")
            .isLength({max: 30}).withMessage("title length should be less than 30"),
        body("shortDescription")
            .isString().withMessage("shortDescription should be a string")
            .trim()
            .isLength({min: 1}).withMessage("shortDescription should not be empty")
            .isLength({max: 100}).withMessage("shortDescription length should be less than 100"),
        body("content")
            .isString().withMessage("content should be a string")
            .trim()
            .isLength({min: 1}).withMessage("content should not be empty")
            .isLength({max: 1000}).withMessage("content length should be less than 1000"),
        body("blogId")
            .isString().withMessage("blogId should be a string")
            .trim()
            .isLength({min: 1}).withMessage("blogId should not be empty")
    ]
})
