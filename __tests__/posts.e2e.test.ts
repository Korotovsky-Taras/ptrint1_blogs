import {createBlog, createNewUserModel, createPost, createUser, generateString, requestApp} from "./utils";
import {BlogViewModel, PostViewModel, Status, UserViewModel} from "../src/types";
import {CommentCreateModel} from "../src/types/comments";
import {createAuthToken} from "../src/utils/authToken";

let blog: BlogViewModel | null = null;
let post: PostViewModel | null = null;
let user: UserViewModel | null = null;

describe("posts testing", () => {

    beforeAll(async () => {
        await requestApp.delete("/testing/all-data");
        blog = await createBlog();
        post = await createPost(blog.id);
        user = await createUser(createNewUserModel());
    })

    it("should create comment", async () => {

        expect(blog).not.toBeNull();
        expect(post).not.toBeNull();
        expect(user).not.toBeNull();

        if (blog && post && user) {
            await requestApp
                .post(`/posts/${post.id}/comments`)
                .set('Authorization', 'Bearer ' + createAuthToken(user.id))
                .set('Content-Type', 'application/json')
                .send({
                    content: generateString(20)
                } as CommentCreateModel)
                .expect(Status.CREATED);
        }

    })

    it("should 400 if passed body is incorrect", async () => {

        expect(blog).not.toBeNull();
        expect(post).not.toBeNull();
        expect(user).not.toBeNull();

        if (blog && post && user) {
            await requestApp
                .post(`/posts/${post.id}/comments`)
                .set('Authorization', 'Bearer ' + createAuthToken(user.id))
                .set('Content-Type', 'application/json')
                .send({
                    content: generateString(6)
                } as CommentCreateModel)
                .expect(Status.BAD_REQUEST);

            await requestApp
                .post(`/posts/${post.id}/comments`)
                .set('Authorization', 'Bearer ' + createAuthToken(user.id))
                .set('Content-Type', 'application/json')
                .send({
                    content: generateString(400)
                } as CommentCreateModel)
                .expect(Status.BAD_REQUEST);
        }

    })

    it("should 401 user unathorized", async () => {

        expect(blog).not.toBeNull();
        expect(post).not.toBeNull();

        if (blog && post) {
            await requestApp
                .post(`/posts/${post.id}/comments`)
                .set('Content-Type', 'application/json')
                .send({
                    content: generateString(20)
                } as CommentCreateModel)
                .expect(Status.UNATHORIZED);

        }

    })

    it("should 404 if postId not exist", async () => {

        expect(blog).not.toBeNull();
        expect(post).not.toBeNull();
        expect(user).not.toBeNull();
        const fakePostId = "64b92eac872655d706c510f1";

        if (blog && post && user) {
            await requestApp
                .post(`/posts/${fakePostId}/comments`)
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + createAuthToken(user.id))
                .send({
                    content: generateString(20)
                } as CommentCreateModel)
                .expect(Status.NOT_FOUND);

        }

    })

})