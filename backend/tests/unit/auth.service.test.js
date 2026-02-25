import {describe, it, expect, vi, beforeEach, should} from "vitest";

vi.mock("../../repositories/user.repository.js", ()=> ({
  findOneUser: vi.fn(),
  createUser: vi.fn(),
  findUserByEmailWithPassword: vi.fn(),
  addRefreshTokenAndRole: vi.fn(),
}))

vi.mock("../../utils/tokenGenerator.js", ()=> ({
  generateAccessToken: vi.fn(),
  generateRefreshToken: vi.fn(),
}))

vi.mock("bcrypt", ()=> ({
  default: {
    hash:vi.fn(),
    compare: vi.fn(),
  }
}))

import { registerUser, loginUser } from "../../services/auth.service";
import * as userRepo from "../../repositories/user.repository.js"
import bcrypt from "bcrypt"; 
import { generateAccessToken, generateRefreshToken } from "../../utils/tokenGenerator.js";

describe("Auth Service - Register", () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

   it("should register a new user successfully", async () => {

    // 1️⃣ Arrange (prepare fake behavior)

    userRepo.findOneUser.mockResolvedValue(null);

    bcrypt.hash.mockResolvedValue("hashed123")

    userRepo.createUser.mockResolvedValue({
      username: "john",
      email: "john@mail.com"
    })

    // 2️⃣ Act (call the function)

    const result = await registerUser({
      username: "john",
      email: "john@mail.com",
      password: "123456"
    })

    // 3️⃣ Assert (verify behavior)
    expect(result).toEqual({
      username: "john",
      email: "john@mail.com"
    })

    expect(userRepo.findOneUser).toHaveBeenCalledTimes(1)

    expect(bcrypt.hash).toHaveBeenCalledWith("123456",10)

    expect(userRepo.createUser).toHaveBeenCalledWith({
      username: "john",
      email: "john@mail.com",
      password: "hashed123",
    })
   })

   it("should throw error if email already exists", async () => {
    userRepo.findOneUser.mockResolvedValue({
      email: "john@mail.com",
      username: "john"
    })

    await expect(registerUser({
      username: "john",
      email: "john@mail.com",
      password: "123456"
    })).rejects.toThrow("Email already exists")

    expect(bcrypt.hash).not.toHaveBeenCalled()
    expect(userRepo.createUser).not.toHaveBeenCalled()

  })

  it("should throw error if username already exists", async()=> {
    userRepo.findOneUser.mockResolvedValue({
      email: "john@mail.com",
      username: "john"
    })

    await expect(registerUser({
      username: "john",
      email: "aman@mail.com",
      password: "123456"
    })).rejects.toThrow("Username already exists")

    expect(bcrypt.hash).not.toHaveBeenCalled()
    expect(userRepo.createUser).not.toHaveBeenCalled()
  })

  it("should throw error DB down", async()=> {
    userRepo.findOneUser.mockResolvedValue(null)

    bcrypt.hash.mockResolvedValue("hashed123")

    userRepo.createUser.mockRejectedValue(new Error("DB down"))

    await expect(registerUser({
      username: "john",
      email: "john@mail.com",
      password: "123456"
    })).rejects.toThrow("DB down")

    expect(userRepo.findOneUser).toHaveBeenCalledTimes(1)

    expect(bcrypt.hash).toHaveBeenCalledWith("123456",10)

    expect(userRepo.createUser).toHaveBeenCalledWith({
      username: "john",
      email: "john@mail.com",
      password: "hashed123",
    })
  })

  it("should throw error hash fail", async ()=> {
    userRepo.findOneUser.mockResolvedValue(null)
    bcrypt.hash.mockRejectedValue(new Error("Hash fail"))

    await expect(registerUser({
      username: "john",
      email: "john@mail.com",
      password: "123456"
    })).rejects.toThrow("Hash fail")

    expect(userRepo.findOneUser).toHaveBeenCalledTimes(1)
    expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10)
    expect(userRepo.createUser).not.toHaveBeenCalled()

  })
})


describe("Auth Service - Login", ()=> {
  beforeEach(()=>{
    vi.clearAllMocks()
  })

  it("should throw error Invalid email or password", async ()=> {
    userRepo.findUserByEmailWithPassword.mockResolvedValue(null)

    await expect(loginUser({email: "john@mail.com", password:"123456"})).rejects.toThrow("Invalid email or password")

    expect(bcrypt.compare).not.toHaveBeenCalled()
    expect(generateAccessToken).not.toHaveBeenCalled()
    expect(generateRefreshToken).not.toHaveBeenCalled()
    expect(userRepo.addRefreshTokenAndRole).not.toHaveBeenCalled()
  })

  it("should throw error Unauthorized", async ()=> {
    userRepo.findUserByEmailWithPassword.mockResolvedValue({_id: "123456789", email: "john@mail.com", password:"hashed123", role:"user"})
    bcrypt.compare.mockResolvedValue(false)

    await expect(loginUser({email: "john@mail.com", password:"123456"})).rejects.toThrow("Unauthorized")

    expect(bcrypt.compare).toHaveBeenCalledWith("123456", "hashed123")
    expect(generateAccessToken).not.toHaveBeenCalled()
    expect(generateRefreshToken).not.toHaveBeenCalled()
    expect(userRepo.addRefreshTokenAndRole).not.toHaveBeenCalled()
  })

  it("should login a user successfully", async()=> {
    userRepo.findUserByEmailWithPassword.mockResolvedValue({_id: "123456789", email: "john@mail.com", password:"hashed123", role:"user"})
    bcrypt.compare.mockResolvedValue(true)
    generateAccessToken.mockReturnValue("mockAccess")
    generateRefreshToken.mockReturnValue("mockRefresh")
    bcrypt.hash.mockResolvedValue("hashedToken")
    userRepo.addRefreshTokenAndRole.mockResolvedValue()

    const result = await loginUser({email:"john@mail.com", password:"123456"})

    expect(result).toEqual({
      accessToken: "mockAccess",
      refreshToken: "mockRefresh",
    })

    expect(userRepo.findUserByEmailWithPassword).toHaveBeenCalledWith("john@mail.com")
    expect(bcrypt.compare).toHaveBeenCalledWith("123456", "hashed123")
    expect(generateAccessToken).toHaveBeenCalledWith("123456789", "user")
    expect(generateRefreshToken).toHaveBeenCalledWith("123456789", "user")
    expect(bcrypt.hash).toHaveBeenCalledWith("mockRefresh", 10)
    expect(userRepo.addRefreshTokenAndRole).toHaveBeenCalledWith("123456789", "hashedToken", "user")
  })

  it("should throw error when fetching saved user", async()=> {
    userRepo.findUserByEmailWithPassword.mockRejectedValue(new Error("DB down"))

    await expect(loginUser({email: "john@mail.com", password:"123456"})).rejects.toThrow("DB down")

    expect(bcrypt.compare).not.toHaveBeenCalled()
    expect(generateAccessToken).not.toHaveBeenCalled()
    expect(generateRefreshToken).not.toHaveBeenCalled()
    expect(userRepo.addRefreshTokenAndRole).not.toHaveBeenCalled()
  })

  it("should throw error bcrypt compare fail", async()=> {
      userRepo.findUserByEmailWithPassword.mockResolvedValue({_id: "123456789", email: "john@mail.com", password:"hashed123", role:"user"})
      bcrypt.compare.mockRejectedValue(new Error("Compare fail"))

      await expect(loginUser({email: "john@mail.com", password:"123456"})).rejects.toThrow("Compare fail")

      expect(userRepo.findUserByEmailWithPassword).toHaveBeenCalledWith("john@mail.com")
      expect(bcrypt.compare).toHaveBeenCalledWith("123456", "hashed123")
      expect(generateAccessToken).not.toHaveBeenCalled()
      expect(generateRefreshToken).not.toHaveBeenCalled()
      expect(userRepo.addRefreshTokenAndRole).not.toHaveBeenCalled()
  })

  it("should throw error hash fail", async()=> {
    userRepo.findUserByEmailWithPassword.mockResolvedValue({_id: "123456789", email: "john@mail.com", password:"hashed123", role:"user"})
    bcrypt.compare.mockResolvedValue(true)
    generateAccessToken.mockReturnValue("mockAccess")
    generateRefreshToken.mockReturnValue("mockRefresh")
    bcrypt.hash.mockRejectedValue(new Error("Hash fail"))

    await expect(loginUser({email: "john@mail.com", password:"123456"})).rejects.toThrow("Hash fail")

    expect(userRepo.findUserByEmailWithPassword).toHaveBeenCalledWith("john@mail.com")
    expect(bcrypt.compare).toHaveBeenCalledWith("123456", "hashed123")
    expect(generateAccessToken).toHaveBeenCalledWith("123456789", "user")
    expect(generateRefreshToken).toHaveBeenCalledWith("123456789", "user")
    expect(bcrypt.hash).toHaveBeenCalledWith("mockRefresh", 10)
    expect(userRepo.addRefreshTokenAndRole).not.toHaveBeenCalled()
  })

  it("should throw error when saving refresh token fails", async ()=> {
    userRepo.findUserByEmailWithPassword.mockResolvedValue({_id: "123456789", email: "john@mail.com", password:"hashed123", role:"user"})
    bcrypt.compare.mockResolvedValue(true)
    generateAccessToken.mockReturnValue("mockAccess")
    generateRefreshToken.mockReturnValue("mockRefresh")
    bcrypt.hash.mockResolvedValue("hashedToken")
    userRepo.addRefreshTokenAndRole.mockRejectedValue(new Error("DB down"))

    await expect(loginUser({email:"john@mail.com", password:"123456"})).rejects.toThrow("DB down")

    expect(userRepo.findUserByEmailWithPassword).toHaveBeenCalledWith("john@mail.com")
    expect(bcrypt.compare).toHaveBeenCalledWith("123456", "hashed123")
    expect(generateAccessToken).toHaveBeenCalledWith("123456789", "user")
    expect(generateRefreshToken).toHaveBeenCalledWith("123456789", "user")
    expect(bcrypt.hash).toHaveBeenCalledWith("mockRefresh", 10)
    expect(userRepo.addRefreshTokenAndRole).toHaveBeenCalledWith("123456789", "hashedToken", "user")
  })
})

