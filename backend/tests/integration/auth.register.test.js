import request from "supertest"
import app from "../../app.js"
import User from "../../models/user.model.js"
import { beforeAll,beforeEach,afterAll, it, expect } from "vitest"
import { connectTestDB, clearTestDB, closeTestDB } from "../setup.js"

describe("POST /api/auth/register (Integration)", () => {
  beforeAll(connectTestDB)
  afterAll(closeTestDB)
  beforeEach(clearTestDB)

  const userData = (overrides={}) => ({
      email: "test@example.com",
      username: "testuser",
      password: "StrongPass123!",
      ...overrides
    })

  it("should register a new user successfully", async () => {
    // Act
    const response = await request(app)
      .post("/api/auth/register")
      .send(userData())

    // Assert
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("email", userData().email)
    expect(response.body).toHaveProperty("username",userData().username)

    // Password should NOT be returned
    expect(response.body.password).toBeUndefined()

    // Verify user actually exists in DB
    const userInDb = await User.findOne({ email: userData().email })

    expect(userInDb).not.toBeNull()
    expect(userInDb.password).not.toBe(userData().password) // hashed
  })

  it("should return 400 when email already exists", async()=> {
    const response = await request(app)
      .post("/api/auth/register")
      .send(userData())

    expect(response.status).toBe(201)

    const newUserData = userData({username: "test"})

    const newResponse = await request(app)
      .post("/api/auth/register")
      .send(newUserData)

      expect(newResponse.status).toBe(400)
      expect(newResponse.body.message).toContain("Email")

      const savedUser = await User.find()
      expect(savedUser.length).toBe(1)
  })

  it("should return 400 when username already exists", async()=> {
    const response = await request(app)
      .post("/api/auth/register")
      .send(userData())

    expect(response.status).toBe(201)

    const newUserData = userData({email: "test2@example.com"})

    const newResponse = await request(app)
      .post("/api/auth/register")
      .send(newUserData)

      expect(newResponse.status).toBe(400)
      expect(newResponse.body.message).toContain("Username")

      const savedUser = await User.find()
      expect(savedUser.length).toBe(1)
  })

  it("should return 400 when password is too short", async()=> {
    const invalidUser = userData({ password: "123456" })

    const response = await request(app)
      .post("/api/auth/register")
      .send(invalidUser)

    expect(response.status).toBe(400)
    expect(response.body.message).toBe("Validation error")
    expect(response.body).toHaveProperty("errors")
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({path:"password"})
      ])
    )

    const user = await User.findOne({email: invalidUser.email})
    expect(user).toBeNull()
  })

  it("should return 400 when password is missing", async()=> {
    const invalidUser = userData()
    delete invalidUser.password

    const response = await request(app)
      .post("/api/auth/register")
      .send(invalidUser)
    
    expect(response.status).toBe(400)
    expect(response.body.message).toBe("Validation error")
    expect(response.body).toHaveProperty("errors")
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({path:"password"})
      ])
    )

    const user = await User.findOne({email: invalidUser.email})
    expect(user).toBeNull()
  })

  it("should return 400 when email format is invalid", async()=> {
    const invalidUser = userData({email: "test7282@$"})

    const response = await request(app)
      .post("/api/auth/register")
      .send(invalidUser)

    expect(response.status).toBe(400)
    expect(response.body.message).toBe("Validation error")
    expect(response.body).toHaveProperty("errors")
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({path:"email"})
      ])
    )

    const user = await User.findOne({email: invalidUser.email})
    expect(user).toBeNull()
  })
})