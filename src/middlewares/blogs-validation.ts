import {withValidator} from "../utils/withValidator";
import {body} from "express-validator";

export const blogsCreationValidator = withValidator(() => {
    return [
        body("name")
            .isString().withMessage("name should be a string")
            .trim()
            .isLength({min: 1}).withMessage("name should not be empty")
            .isLength({max: 15}).withMessage("name length should be less than 15"),
        body("description")
            .isString().withMessage("description should be a string")
            .trim()
            .isLength({min: 1}).withMessage("description should not be empty")
            .isLength({max: 500}).withMessage("description length should be less than 500"),
        body("websiteUrl")
            .isString().withMessage("websiteUrl should be a string")
            .trim()
            .isLength({min: 1}).withMessage("websiteUrl should not be empty")
            .isLength({max: 100}).withMessage("websiteUrl length should be less than 100")
            .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage("websiteUrl should match pattern 'https://'"),
    ]
})