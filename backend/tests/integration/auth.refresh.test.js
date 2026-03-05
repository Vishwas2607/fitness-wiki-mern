import request from "supertest"
import app from "../../app.js"
import User from "../../models/user.model.js"
import { vi, beforeAll,beforeEach,afterAll, it, expect, describe, afterEach, should } from "vitest"
import { connectTestDB, clearTestDB, closeTestDB } from "../setup.js"
import jwt from "jsonwebtoken"

describe("POST /api/auth/refresh-token (Integration)", ()=> {
    beforeAll(connectTestDB)
    beforeEach(clearTestDB)
    afterAll(closeTestDB)

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

    it("should generate new access and refresh token successfully", async()=> {
    await request(app)
        .post("/api/auth/register")
        .send(registerUserData())

    const payload = loginUserData()

    const loginResponse = await request(app)
                            .post("/api/auth/login")
                            .send(payload)

    const cookies = loginResponse.headers["set-cookie"]
    expect(cookies).toBeDefined()
    
    const accessCookie = cookies.find(c=> c.startsWith("accessToken=")).replace("accessToken=","")
    const refreshCookie = cookies.find(c=> c.startsWith("refreshToken=")).replace("refreshToken=","")
    expect(refreshCookie).toBeDefined()

    vi.advanceTimersByTime(1000)

    const response = await request(app)
                        .post("/api/auth/refresh-token")
                        .set('Cookie', [`accessToken=${accessCookie}`, `refreshToken=${refreshCookie}`])
    
    expect(response.status).toBe(200)
    const newCookies = response.headers["set-cookie"]
    expect(newCookies).toBeDefined()

    const newAccessCookie = newCookies.find(c=> c.startsWith("accessToken=")).replace("accessToken=","")
    const newRefreshCookie = newCookies.find(c=> c.startsWith("refreshToken=")).replace("refreshToken=","")

    expect(newAccessCookie).toBeDefined()
    expect(newRefreshCookie).toBeDefined()

    expect(newAccessCookie).not.toEqual(accessCookie)
    expect(newRefreshCookie).not.toEqual(refreshCookie)

    const user = await User.findOne({email:payload.email}).select("+refreshToken")
    expect(user.refreshToken).toBeDefined()
    })

    it("should return 401 Unauthorized when refreshToken is missing", async()=> {
    await request(app)
        .post("/api/auth/register")
        .send(registerUserData())

    const payload = loginUserData()

    const loginResponse = await request(app)
                            .post("/api/auth/login")
                            .send(payload)

    const cookies = loginResponse.headers["set-cookie"]
    expect(cookies).toBeDefined()
    
    const accessCookie = cookies.find(c=> c.startsWith("accessToken=")).replace("accessToken=","")
    const refreshCookie = cookies.find(c=> c.startsWith("refreshToken=")).replace("refreshToken=","")
    expect(refreshCookie).toBeDefined()

    vi.advanceTimersByTime(1000)

    const response = await request(app)
                        .post("/api/auth/refresh-token")
                        .set('Cookie', [`accessToken=${accessCookie}`])
    
    expect(response.status).toBe(401)
    const newCookies = response.headers["set-cookie"]
    expect(newCookies).not.toBeDefined()

    const user = await User.findOne({email:payload.email}).select("+refreshToken")
    expect(user.refreshToken).toBeDefined()
    })

    it("should return 403 Forbidden when refreshToken is invalid", async()=> {
    await request(app)
        .post("/api/auth/register")
        .send(registerUserData())

    const payload = loginUserData()

    const loginResponse = await request(app)
                            .post("/api/auth/login")
                            .send(payload)

    const cookies = loginResponse.headers["set-cookie"]
    expect(cookies).toBeDefined()
    
    const accessCookie = cookies.find(c=> c.startsWith("accessToken=")).replace("accessToken=","")
    let refreshCookie = cookies.find(c=> c.startsWith("refreshToken=")).replace("refreshToken=","")
    expect(refreshCookie).toBeDefined()

    refreshCookie = jwt.sign({id:"user123"}, "wrong_secret", {expiresIn: "15m"})

    vi.advanceTimersByTime(1000)

    const response = await request(app)
                        .post("/api/auth/refresh-token")
                        .set('Cookie', [`accessToken=${accessCookie}`, `refreshToken=${refreshCookie}`])
    
    expect(response.status).toBe(403)
    const newCookies = response.headers["set-cookie"]
    expect(newCookies).not.toBeDefined()

    const user = await User.findOne({email:payload.email}).select("+refreshToken")
    expect(user.refreshToken).toBeDefined()
    })

    it("should return 401 Token Expired when refreshToken is expired", async()=> {
    await request(app)
        .post("/api/auth/register")
        .send(registerUserData())

    const payload = loginUserData()

    const loginResponse = await request(app)
                            .post("/api/auth/login")
                            .send(payload)

    const cookies = loginResponse.headers["set-cookie"]
    expect(cookies).toBeDefined()
    
    const accessCookie = cookies.find(c=> c.startsWith("accessToken=")).replace("accessToken=","")
    let refreshCookie = cookies.find(c=> c.startsWith("refreshToken=")).replace("refreshToken=","")
    expect(refreshCookie).toBeDefined()

    refreshCookie = jwt.sign({id:"user123"}, process.env.JWT_REFRESH_SECRET, {expiresIn: "-1h"})

    vi.advanceTimersByTime(1000)

    const response = await request(app)
                        .post("/api/auth/refresh-token")
                        .set('Cookie', [`accessToken=${accessCookie}`, `refreshToken=${refreshCookie}`])
    
    expect(response.status).toBe(401)
    const newCookies = response.headers["set-cookie"]
    expect(newCookies).not.toBeDefined()

    const user = await User.findOne({email:payload.email}).select("+refreshToken")
    expect(user.refreshToken).toBeDefined()
    })

    // it("should return 403 when refreshToken reuse detected", async()=> {
    // await request(app)
    //     .post("/api/auth/register")
    //     .send(registerUserData())

    // const payload = loginUserData()

    // const loginResponse = await request(app)
    //                         .post("/api/auth/login")
    //                         .send(payload)

    // const originalCookies = loginResponse.headers["set-cookie"]
    // const originalRefreshToken = originalCookies.find(c=> c.startsWith("refreshToken=")).replace("refreshToken=","")

    // const originalUser = await User.findOne({email: payload.email}).select("+refreshToken")

    // vi.advanceTimersByTime(1000)
    // const firstRefreshResponse = await request(app)
    //                     .post("/api/auth/refresh-token")
    //                     .set('Cookie',[`refreshToken=${originalRefreshToken}`])

    // const refreshCookies = firstRefreshResponse.headers["set-cookie"]
    // const firstRefreshToken =refreshCookies.find(c=> c.startsWith("refreshToken=")).replace("refreshToken=","")

    // const afterRefreshUser = await User.findOne({email: payload.email}).select("+refreshToken")

    // console.log("After Login DB:", originalUser.refreshToken)
    // console.log("After Refresh DB:", afterRefreshUser.refreshToken)

    // expect(originalRefreshToken).not.toEqual(firstRefreshToken)
 
    // vi.advanceTimersByTime(1000)
    // const secondRefreshResponse = await request(app)
    //                     .post("/api/auth/refresh-token")
    //                     .set('Cookie',[`refreshToken=${originalRefreshToken}`])

    // expect(secondRefreshResponse.status).toBe(403)
    // const newCookies = secondRefreshResponse.headers["set-cookie"]
    // expect(newCookies).not.toBeDefined()

    // const user = await User.findOne({email:payload.email}).select("+refreshToken")
    // expect(user.refreshToken).toBe("")
    // })
})