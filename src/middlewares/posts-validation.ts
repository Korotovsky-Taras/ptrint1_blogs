import {withValidator} from "../utils/withValidator";
import {checkSchema} from "express-validator";

export const postsCreationValidator = withValidator(() => {
    return [
        checkSchema({
            title: {
                isString: {
                    bail: true,
                    errorMessage: "should be a string",
                },
                isLength: {
                    options: { min: 1, max: 30 },
                    errorMessage: "length should be > 0 < 30"
                },
            }
        }),
        checkSchema({
            shortDescription: {
                isString: {
                    bail: true,
                    errorMessage: "should be a string",
                },
                isLength: {
                    options: { min: 1, max: 100 },
                    errorMessage: "length should be > 0 < 100"
                },
            }
        }),
        checkSchema({
            content: {
                isString: {
                    bail: true,
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
                isString: {
                    bail: true,
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
