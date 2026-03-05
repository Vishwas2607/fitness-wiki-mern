import request from "supertest"
import app from "../../app.js"
import User from "../../models/user.model.js"
import { vi, beforeAll,beforeEach,afterAll, it, expect, describe, afterEach } from "vitest"
import { connectTestDB, clearTestDB, closeTestDB } from "../setup.js"
import jwt from "jsonwebtoken"

describe("POST /api/auth/logout", ()=> {
    beforeAll(connectTestDB)
    afterAll(closeTestDB)
    beforeEach(clearTestDB)

    const registerUserData = (overrides={}) => ({
      email: "test@example.com",
      username: "testuser",
      password: "StrongPass123!",
      ...overrides
    })

    const loginUserData = (overrides={}) => ({
      email: "test@example.com",
      password: "StrongPass123!",
      ...overrides
    })

    it("should logout a user successfully", async()=> {
        await request(app)
            .post("/api/auth/register")
            .send(registerUserData())

        const payload = loginUserData()

        const loginResponse = await request(app)
            .post("/api/auth/login")
            .send(payload)

        const cookies = loginResponse.headers["set-cookie"]
        const refreshToken = cookies.find(c=> c.startsWith("refreshToken=")).replace("refreshToken=","")

        const logoutResponse = await request(app).post("/api/auth/logout").set("Cookie", [`refreshToken=${refreshToken}`])

        expect(logoutResponse.status).toBe(200)

        const logoutCookies = logoutResponse.headers["set-cookie"]
        const newRefreshToken = logoutCookies.find(c=> c.startsWith("refreshToken="))
        expect(newRefreshToken).toContain("refreshToken=;")

        const user = await User.findOne({email: payload.email}).select("+refreshToken")
        expect(user.refreshToken).toBe("")
    })

    it("should return 401 Unauthorized if refresh token is missing", async()=> {
        await request(app)
            .post("/api/auth/register")
            .send(registerUserData())

        const payload = loginUserData()

        await request(app)
            .post("/api/auth/login")
            .send(payload)

        const logoutResponse = await request(app).post("/api/auth/logout")

        expect(logoutResponse.status).toBe(401)

        const logoutCookies = logoutResponse.headers["set-cookie"]
        expect(logoutCookies).toBeUndefined()

        const user = await User.findOne({email: payload.email}).select("+refreshToken")
        expect(user.refreshToken).not.toBe("")
    })

    it("should return 401 Token Expired when refreshToken is expired", async()=> {
        await request(app)
            .post("/api/auth/register")
            .send(registerUserData())

        const payload = loginUserData()

        await request(app)
            .post("/api/auth/login")
            .send(payload)

        const refreshToken = jwt.sign({id:"user123"}, process.env.JWT_REFRESH_SECRET, {expiresIn: "-1h"})
        const logoutResponse = await request(app).post("/api/auth/logout").set("Cookie", [`refreshToken=${refreshToken}`])

        expect(logoutResponse.status).toBe(401)

        const logoutCookies = logoutResponse.headers["set-cookie"]
        expect(logoutCookies).toBeUndefined()

        const user = await User.findOne({email: payload.email}).select("+refreshToken")
        expect(user.refreshToken).not.toBe("")
    })

    it("should return 403 Forbiden when refreshToken is invalid", async()=> {
        await request(app)
            .post("/api/auth/register")
            .send(registerUserData())

        const payload = loginUserData()

        await request(app)
            .post("/api/auth/login")
            .send(payload)

        const refreshToken = jwt.sign({id:"user123"}, "wrong_secret", {expiresIn: "15m"})

        const logoutResponse = await request(app).post("/api/auth/logout").set("Cookie", [`refreshToken=${refreshToken}`])

        expect(logoutResponse.status).toBe(403)

        const logoutCookies = logoutResponse.headers["set-cookie"]
        expect(logoutCookies).toBeUndefined()

        const user = await User.findOne({email: payload.email}).select("+refreshToken")
        expect(user.refreshToken).not.toBe("")
    })

    it("should return 404 user not found when refreshToken payload is modified", async()=> {
        await request(app)
            .post("/api/auth/register")
            .send(registerUserData())

        const payload = loginUserData()

        await request(app)
            .post("/api/auth/login")
            .send(payload)

        const newrefreshToken = jwt.sign({sub:"123456789012345678901234"}, process.env.JWT_REFRESH_SECRET, {expiresIn: "7d"})
        const logoutResponse = await request(app).post("/api/auth/logout").set("Cookie", [`refreshToken=${newrefreshToken}`])

        expect(logoutResponse.status).toBe(404)

        const logoutCookies = logoutResponse.headers["set-cookie"]
        expect(logoutCookies).toBeUndefined()

        const user = await User.findOne({email: payload.email}).select("+refreshToken")
        expect(user.refreshToken).not.toBe("")
    })

})
