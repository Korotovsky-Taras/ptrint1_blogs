import {createCookie, createNewUserModel, createUser, extractCookie, requestApp, UserCreationTestModel,} from "./utils";
import {Status, UserViewModel} from "../src/types";

let userModel: UserCreationTestModel = createNewUserModel();
let user: UserViewModel | null = null;

let userAgents = ["app1", "app2", "app3", "app4"];
let refreshTokens = new Map();
let deviceIDs = new Map();

describe("security testing", () => {

    beforeAll(async () => {
        await requestApp.delete("/testing/all-data");
        user = await createUser(userModel);
        refreshTokens.clear();
    })

    it("should login user on 4 devices", async () => {

        for (const userAgent of userAgents) {
            const res = await requestApp
                .post(`/auth/login`)
                .set('Content-Type', 'application/json')
                .set('User-Agent', userAgent)
                .send({
                    loginOrEmail: userModel.login,
                    password: userModel.password
                }).expect(Status.OK)

            expect(res.body).toEqual({
                accessToken: expect.any(String)
            })
            const cookie = extractCookie(res, "refreshToken");

            expect(cookie).not.toBeNull();
            refreshTokens.set(userAgent, cookie);
        }

    })

    it("should return list of 4 devices", async () => {

        const agent = userAgents[0];
        const refreshToken = refreshTokens.get(agent);

        expect(refreshToken).not.toBeNull()

        const res = await requestApp
            .get(`/security/devices`)
            .set('User-Agent', agent)
            .set("Cookie", [createCookie({
                refreshToken: refreshToken.value,
                Path: "/",
                HttpOnly: true,
                Secure: true
            })])
            .expect(Status.OK)

        expect(res.body).toHaveLength(4);

        deviceIDs.clear();
        res.body.map((device: any) => {
            deviceIDs.set(device.title, device.deviceId);
        })
    })

    it("should update refreshToken 1 device", async () => {

        const agent = userAgents[0];
        const oldToken = refreshTokens.get(agent);

        expect(oldToken).not.toBeNull()

        const res = await requestApp
            .post(`/auth/refresh-token`)
            .set('User-Agent', agent)
            .set("Cookie", [createCookie({
                refreshToken: oldToken.value,
                Path: "/",
                HttpOnly: true,
                Secure: true
            })])
            .expect(Status.OK)

        const cookie = extractCookie(res, "refreshToken");

        expect(cookie.value).not.toBeNull();
        expect(cookie.value).not.toEqual(oldToken.value);

    })

    it("should return list of 4 devices too", async () => {

        const agent = userAgents[2];
        const refreshToken = refreshTokens.get(agent);

        expect(refreshToken).not.toBeNull()

        const res = await requestApp
            .get(`/security/devices`)
            .set('User-Agent', agent)
            .set("Cookie", [createCookie({
                refreshToken: refreshToken.value,
                Path: "/",
                HttpOnly: true,
                Secure: true
            })])
            .expect(Status.OK)

        expect(res.body).toHaveLength(4);

        deviceIDs.clear();
        res.body.map((device: any) => {
            deviceIDs.set(device.title, device.deviceId);
        })

    })

    it("should delete 2cond device", async () => {

        const agent2 = userAgents[2];
        const deviceId2 = deviceIDs.get(agent2);
        const refreshToken2 = refreshTokens.get(agent2);

        expect(deviceId2).not.toBeNull()
        expect(refreshToken2).not.toBeNull()

        await requestApp
            .delete(`/security/devices/${deviceId2}`)
            .set('User-Agent', agent2)
            .set("Cookie", [createCookie({
                refreshToken: refreshToken2.value,
                Path: "/",
                HttpOnly: true,
                Secure: true
            })])
            .expect(Status.NO_CONTENT);

        const agent1 = userAgents[1];
        const refreshToken1 = refreshTokens.get(agent1);
        expect(agent1).not.toBeNull()
        expect(refreshToken1).not.toBeNull()

        const res = await requestApp
            .get(`/security/devices`)
            .set('User-Agent', agent1)
            .set("Cookie", [createCookie({
                refreshToken: refreshToken1.value,
                Path: "/",
                HttpOnly: true,
                Secure: true
            })])
            .expect(Status.OK)

        expect(res.body).toHaveLength(3);

        deviceIDs.clear();
        res.body.map((device: any) => {
            deviceIDs.set(device.title, device.deviceId);
        })

        expect(deviceIDs.get(agent2)).toBeUndefined()

    })


    it("should logout device 3", async () => {

        const agent3 = userAgents[3];
        const deviceId3 = deviceIDs.get(agent3);
        const refreshToken3 = refreshTokens.get(agent3);

        expect(deviceId3).not.toBeNull()
        expect(refreshToken3).not.toBeNull()

        await requestApp
            .post(`/auth/logout`)
            .set('User-Agent', agent3)
            .set("Cookie", [createCookie({
                refreshToken: refreshToken3.value,
                Path: "/",
                HttpOnly: true,
                Secure: true
            })])
            .expect(Status.NO_CONTENT)

        const agent1 = userAgents[1];
        const refreshToken1 = refreshTokens.get(agent1);
        expect(agent1).not.toBeNull()
        expect(refreshToken1).not.toBeNull()

        const res = await requestApp
            .get(`/security/devices`)
            .set('User-Agent', agent1)
            .set("Cookie", [createCookie({
                refreshToken: refreshToken1.value,
                Path: "/",
                HttpOnly: true,
                Secure: true
            })])
            .expect(Status.OK)

        expect(res.body).toHaveLength(2);

        deviceIDs.clear();
        res.body.map((device: any) => {
            deviceIDs.set(device.title, device.deviceId);
        })

        expect(deviceIDs.get(agent3)).toBeUndefined()
    })


    it("should remove all devices expect device 1", async () => {

        const agent1 = userAgents[1];
        const deviceId1 = deviceIDs.get(agent1);
        const refreshToken1 = refreshTokens.get(agent1);

        expect(deviceId1).not.toBeNull()
        expect(refreshToken1).not.toBeNull()

        await requestApp
            .delete(`/security/devices`)
            .set('User-Agent', agent1)
            .set("Cookie", [createCookie({
                refreshToken: refreshToken1.value,
                Path: "/",
                HttpOnly: true,
                Secure: true
            })])
            .expect(Status.NO_CONTENT)

        const res = await requestApp
            .get(`/security/devices`)
            .set('User-Agent', agent1)
            .set("Cookie", [createCookie({
                refreshToken: refreshToken1.value,
                Path: "/",
                HttpOnly: true,
                Secure: true
            })])
            .expect(Status.OK)


        expect(res.body).toHaveLength(1);

        deviceIDs.clear();
        res.body.map((device: any) => {
            deviceIDs.set(device.title, device.deviceId);
        })

        const agent2 = userAgents[2];
        const agent3 = userAgents[3];
        const agent4 = userAgents[4];

        expect(deviceIDs.get(agent2)).toBeUndefined()
        expect(deviceIDs.get(agent3)).toBeUndefined()
        expect(deviceIDs.get(agent4)).toBeUndefined()
    })


})