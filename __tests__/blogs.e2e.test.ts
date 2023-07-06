import supertest from "supertest";
import {app} from "../src/app";
import {BlogCreateModel, Status} from "../src/types";
import {blogsRepository, postsRepository} from "../src/repositories";
import {PostsCreateModel} from "../src/types/request/posts";

const requestApp = supertest(app);
const authB64 = Buffer.from("admin:qwerty").toString("base64");

const validBlogData: BlogCreateModel = {
    name: "Taras",
    description: "valid",
    websiteUrl: "https://app.by"
}

const validPostData: PostsCreateModel = {
    title: "valid title",
    shortDescription: "valid short description",
    content: "valid content",
    blogId: "1"
}

describe("blogs testing", () => {

    beforeAll(async () => {
        await supertest(app).delete("/testing/all-data");
    })


    it("should require authorization", async () => {
        await requestApp
            .post("/blogs")
            .set('Content-Type', 'application/json')
            .send({})
            .expect(Status.UNATHORIZED)

        await requestApp
            .delete("/blogs/1")
            .expect(Status.UNATHORIZED)

        await requestApp
            .put("/blogs/1")
            .set('Content-Type', 'application/json')
            .send({})
            .expect(Status.UNATHORIZED)

        await requestApp
            .post("/posts")
            .set('Content-Type', 'application/json')
            .send({})
            .expect(Status.UNATHORIZED)

        await requestApp
            .delete("/posts/1")
            .expect(Status.UNATHORIZED)

        await requestApp
            .put("/posts/1")
            .set('Content-Type', 'application/json')
            .send({})
            .expect(Status.UNATHORIZED)
    })

    it("should return not found", async () => {

        await requestApp
            .get("/blogs/1")
            .set('Authorization', 'Basic ' + authB64)
            .expect(Status.NOT_FOUND)

        await requestApp
            .get("/posts/1")
            .set('Authorization', 'Basic ' + authB64)
            .expect(Status.NOT_FOUND)

    })

    it("should create blog", async () => {

        await requestApp
            .post("/blogs")
            .set('Authorization', 'Basic ' + authB64)
            .set('Content-Type', 'application/json')
            .send(validBlogData)
            .expect(Status.CREATED)

        expect(blogsRepository.getBlogs()).toContainEqual({
            id: expect.any(Number),
            name: validBlogData.name,
            description: validBlogData.description,
            websiteUrl: validBlogData.websiteUrl
        })

    })

    it("should create post", async () => {

        await requestApp
            .post("/posts")
            .set('Authorization', 'Basic ' + authB64)
            .set('Content-Type', 'application/json')
            .send(validPostData)
            .expect(Status.CREATED)

        expect(blogsRepository.getBlogs()).toContainEqual({
            id: expect.any(Number),
            name: validBlogData.name,
            description: validBlogData.description,
            websiteUrl: validBlogData.websiteUrl
        })

    })

    it("should update post", async () => {
        const newTitle = "new title";

        await requestApp
            .put("/posts/1")
            .set('Authorization', 'Basic ' + authB64)
            .set('Content-Type', 'application/json')
            .send({
                title: newTitle,
                shortDescription: "valid short description",
                content: "valid content",
                blogId: "1"
            } as PostsCreateModel)
            .expect(Status.NO_CONTENT)

        expect(postsRepository.getPosts()).toContainEqual({
            id: expect.any(String),
            title: newTitle,
            shortDescription: expect.any(String),
            content: expect.any(String),
            blogName: expect.any(String),
            blogId: expect.any(String)
        })

    })


})