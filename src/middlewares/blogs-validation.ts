import {withValidator} from "../utils/withValidator";
import {checkSchema} from "express-validator";

export const blogsCreationValidator = withValidator(() => {
    return [
        checkSchema({
            name: {
                isString: {
                    bail: true,
                    errorMessage: "should be a string",
                },
                isLength: {
                    options: { min: 1, max: 15 },
                    errorMessage: "length should be > 0 < 15"
                },
            }
        }),
        checkSchema({
            description: {
                isString: {
                    bail: true,
                    errorMessage: "should be a string",
                },
                isLength: {
                    options: { min: 1, max: 500 },
                    errorMessage: "length should be > 0 < 500"
                },
            }
        }),
        checkSchema({
            websiteUrl: {
                isString: {
                    bail: true,
                    errorMessage: "should be a string",
                },
                isLength: {
                    options: { min: 1, max: 100 },
                    errorMessage: "length should be > 0 < 100"
                },
                matches: {
                    options: /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
                    errorMessage: "should match pattern 'https://'"
                }
            }
        }),
    ]
})