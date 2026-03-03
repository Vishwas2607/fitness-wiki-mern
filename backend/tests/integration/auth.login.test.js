import request from "supertest"
import app from "../../app.js"
import User from "../../models/user.model.js"
import { vi, beforeAll,beforeEach,afterAll, it, expect, describe, afterEach } from "vitest"
import { connectTestDB, clearTestDB, closeTestDB } from "../setup.js"

describe("POST /api/auth/login (Integration)", ()=>{
    beforeAll(connectTestDB)
    afterAll(closeTestDB)
    beforeEach(clearTestDB)
    beforeEach(()=> {
        vi.useFakeTimers()
    })
    afterEach(()=> {
        vi.useRealTimers();
    })


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

    it("should login a user successfully", async()=> {
    await request(app)
        .post("/api/auth/register")
        .send(registerUserData())

    const loginPayload = loginUserData()

    const response = await request(app)
                        .post("/api/auth/login")
                        .send(loginPayload)

    const cookies = response.headers["set-cookie"]
    expect(cookies).toBeDefined()
    
    const accessCookie = cookies.find(c=> c.startsWith("accessToken="))
    const refreshCookie = cookies.find(c=> c.startsWith("refreshToken="))

    expect(accessCookie).toBeDefined()
    expect(refreshCookie).toBeDefined()

    expect(accessCookie).toContain("HttpOnly")
    expect(refreshCookie).toContain("HttpOnly")

    expect(response.status).toBe(200)
    expect(response.body.message).not.toBeNull()
    expect(response.body.password).toBeUndefined()
    
    const user = await User.findOne({email: loginPayload.email}).select("+refreshToken")
    expect(user.refreshToken).toBeDefined()
    })

    it("should return 401 when password is wrong", async()=> {
    await request(app)
        .post("/api/auth/register")
        .send(registerUserData())

    const loginPayload = loginUserData({password:"12345678"})

    const response = await request(app)
                        .post("/api/auth/login")
                        .send(loginPayload)

    const cookies = response.headers["set-cookie"]
    expect(cookies).not.toBeDefined()

    expect(response.status).toBe(401)
    expect(response.body.message).not.toBeNull()
    expect(response.body.password).toBeUndefined()
    
    const user = await User.findOne({email: loginPayload.email}).select("+refreshToken")
    expect(user.refreshToken).toBeUndefined()
    })

    it("should return 401 when user not exists", async()=> {
    await request(app)
        .post("/api/auth/register")
        .send(registerUserData())

    const loginPayload = loginUserData({email: "john@mail.com"})

    const response = await request(app)
                        .post("/api/auth/login")
                        .send(loginPayload)

    const cookies = response.headers["set-cookie"]
    expect(cookies).not.toBeDefined()

    expect(response.status).toBe(401)
    expect(response.body.message).not.toBeNull()
    expect(response.body.password).toBeUndefined()
    
    const user = await User.findOne({email: loginPayload.email}).select("+refreshToken")
    expect(user).toBeNull()
    })

    it("should return 400 when email is missing", async()=> {
    await request(app)
        .post("/api/auth/register")
        .send(registerUserData())

    const loginPayload = loginUserData()
    delete loginPayload.email

    const response = await request(app)
                        .post("/api/auth/login")
                        .send(loginPayload)

    const cookies = response.headers["set-cookie"]
    expect(cookies).not.toBeDefined()

    expect(response.status).toBe(400)
    expect(response.body.message).not.toBeNull()
    expect(response.body.password).toBeUndefined()
    
    const user = await User.findOne({email: loginPayload.email}).select("+refreshToken")
    expect(user).toBeNull()
    })

    it("should replace refresh token in DB when login twice", async()=> {
    await request(app)
        .post("/api/auth/register")
        .send(registerUserData())

    const loginPayload1 = loginUserData()

    const response = await request(app)
                        .post("/api/auth/login")
                        .send(loginPayload1)

    const cookies = response.headers["set-cookie"]
    expect(cookies).toBeDefined()

    const accessCookie = cookies.find(c=> c.startsWith("accessToken="))
    const refreshCookie = cookies.find(c=> c.startsWith("refreshToken="))

    expect(accessCookie).toBeDefined()
    expect(refreshCookie).toBeDefined()

    expect(accessCookie).toContain("HttpOnly")
    expect(refreshCookie).toContain("HttpOnly")

    expect(response.status).toBe(200)
    
    const user = await User.findOne({email: loginPayload1.email}).select("+refreshToken")
    expect(user.refreshToken).toBeDefined()

    const loginPayload2 = loginUserData()

    vi.advanceTimersByTime(1000)
    const newResponse = await request(app)
                        .post("/api/auth/login")
                        .send(loginPayload2)

    const newCookies = newResponse.headers["set-cookie"]
    expect(newCookies).toBeDefined()

    const newAccessCookie = newCookies.find(c=> c.startsWith("accessToken="))
    const newRefreshCookie = newCookies.find(c=> c.startsWith("refreshToken="))

    expect(newAccessCookie).toBeDefined()
    expect(newRefreshCookie).toBeDefined()

    expect(newAccessCookie).toContain("HttpOnly")
    expect(newRefreshCookie).toContain("HttpOnly")

    expect(newResponse.status).toBe(200)
    
    const newUser = await User.findOne({email: loginPayload2.email}).select("+refreshToken")
    expect(newUser.refreshToken).toBeDefined()
    
    expect(newAccessCookie).not.toEqual(accessCookie)
    expect(newRefreshCookie).not.toEqual(refreshCookie)
    expect(newUser.refreshToken).not.toEqual(user.refreshToken)
    })

})