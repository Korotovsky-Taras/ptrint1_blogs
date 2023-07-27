// TODO tests
import {requestApp} from "./utils";

describe("posts testing", () => {

    beforeAll(async () => {
        await requestApp.delete("/testing/all-data");
    })

    it("should create post", async () => {

    })

})