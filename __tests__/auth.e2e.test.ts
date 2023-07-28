// TODO tests
import {createNewUserModel, createUser, requestApp, UserCreationTestModel} from "./utils";
import {Status, UserViewModel} from "../src/types";

let userModel: UserCreationTestModel = createNewUserModel();
let user: UserViewModel | null = null;

describe("auth testing", () => {

    beforeAll(async () => {
        await requestApp.delete("/testing/all-data");
        user = await createUser(userModel);
    })

    it("should return accessToken ", async () => {

        const result = await requestApp
            .post(`/auth/login`)
            .set('Content-Type', 'application/json')
            .send({
                loginOrEmail: userModel.login,
                password: userModel.password
            })
            .expect(Status.OK);

        expect(result.body).toEqual({
            accessToken: expect.any(String)
        })

    })

    it("should return error if passed wrong login or password; status 401;", async () => {

        await requestApp
            .post(`/auth/login`)
            .set('Content-Type', 'application/json')
            .send({
                loginOrEmail: userModel.login,
                password: "wrong password"
            })
            .expect(Status.UNATHORIZED);


    })

})