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

  it("should throw error email already exists", async()=> {
    const response = await request(app)
      .post("/api/auth/register")
      .send(userData())

    expect(response.status).toBe(201)

    const newUserData = {
      email: "test@example.com",
      username: "test",
      password: "StrongPass123!",
    }

    const newResponse = await request(app)
      .post("/api/auth/register")
      .send(newUserData)

      expect(newResponse.status).toBe(400)
      expect(newResponse.body).toHaveProperty("message","Email already exists")

      const savedUser = await User.find()
      expect(savedUser.length).toBe(1)
  })

  it("should throw zod error Password must be at least 8 characters", async()=> {
    const response = await request(app)
      .post("/api/auth/register")
      .send(userData({password: "123456"}))

    console.log(response.body)

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty("message", "Validation error")

    const user = await User.findOne({email:userData().email})
    expect(user).toBeNull()
  })
})