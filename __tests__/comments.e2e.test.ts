import {
    createBlog,
    createComment,
    createNewUserModel,
    createPost,
    createUser,
    requestApp,
    validCommentData
} from "./utils";
import {BlogViewModel, ErrorsMessage, PostViewModel, Status, UserViewModel} from "../src/types";
import {CommentCreateModel, CommentUpdateModel, CommentViewModel} from "../src/types/comments";
import {createAuthToken} from "../src/utils/authToken";


let blog: BlogViewModel | null = null;
let post: PostViewModel | null = null;
let user: UserViewModel | null = null;
let comment: CommentViewModel | null = null;

describe("comments testing", () => {

    beforeAll(async () => {
        await requestApp.delete("/testing/all-data");
        blog = await createBlog();
        post = await createPost(blog.id);
        user = await createUser(createNewUserModel());
    })

    it("should not create comment", async () => {

        expect(blog).not.toBeNull();
        expect(post).not.toBeNull();
        expect(user).not.toBeNull();

        if (post && blog && user) {
            await requestApp
                .post(`/posts/${post.id}/comments`)
                .set('Content-Type', 'application/json')
                .send({
                    ...validCommentData
                } as CommentCreateModel)
                .expect(Status.UNATHORIZED);

            const result = await requestApp
                .post(`/posts/${post.id}/comments`)
                .set('Authorization', 'Bearer ' + createAuthToken(user.id))
                .set('Content-Type', 'application/json')
                .send({} as CommentCreateModel)
                .expect(Status.BAD_REQUEST);

            expect(result.body).toEqual({
                errorsMessages: [
                    {
                        message: expect.any(String),
                        field: "content"
                    }
                ]
            } as ErrorsMessage)
        }
    })

    it("should create comment", async () => {

        expect(blog).not.toBeNull();
        expect(post).not.toBeNull();
        expect(user).not.toBeNull();

        if (post && blog && user) {
            comment = await createComment(post.id, user.id);

            expect(comment).toEqual({
                id: expect.any(String),
                content: expect.any(String),
                commentatorInfo: { userId: user.id, userLogin: user.login },
                createdAt: expect.any(String),
            })
        }
    })

    it("should update comment", async () => {
        expect(blog).not.toBeNull();
        expect(post).not.toBeNull();
        expect(user).not.toBeNull();
        expect(comment).not.toBeNull();

        if (comment && user) {
             const newContent  = "comment is updated";
             await requestApp
                .put(`/comments/${comment.id}`)
                .set('Authorization', 'Bearer ' + createAuthToken(user.id))
                .set('Content-Type', 'application/json')
                .send({
                    content: newContent
                } as CommentUpdateModel)
                .expect(Status.NO_CONTENT);

            const result = await requestApp
                .get(`/comments/${comment.id}`)
                .set('Content-Type', 'application/json')
                .expect(Status.OK);

            expect(result.body).toEqual({
                id: expect.any(String),
                content: newContent,
                commentatorInfo: expect.any(Object),
                createdAt: expect.any(String),
            } as CommentViewModel)
        }
    })

    it("should return 403 if user not comment owner", async () => {

        expect(blog).not.toBeNull();
        expect(post).not.toBeNull();
        expect(comment).not.toBeNull();
        const newUser = await createUser(createNewUserModel());

        if (post && blog && newUser && comment) {
            await requestApp
                .put(`/comments/${comment.id}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + createAuthToken(newUser.id))
                .send({
                    content: "some new content"
                } as CommentUpdateModel)
                .expect(Status.FORBIDDEN);

        }
    })

    it("should delete comment", async () => {

        expect(blog).not.toBeNull();
        expect(post).not.toBeNull();
        expect(user).not.toBeNull();
        expect(comment).not.toBeNull();

        if (post && blog && user && comment) {
            await requestApp
                .delete(`/comments/${comment.id}`)
                .set('Authorization', 'Bearer ' + createAuthToken(user.id))
                .expect(Status.NO_CONTENT);

            await requestApp
                .get(`/comments/${comment.id}`)
                .set('Content-Type', 'application/json')
                .expect(Status.NOT_FOUND);

        }
    })

})