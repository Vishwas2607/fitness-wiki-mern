import {describe, it, expect, vi, beforeEach} from "vitest";

vi.mock("../../repositories/user.repository.js", ()=> ({
  findOneUser: vi.fn(),
  createUser: vi.fn(),
  findUserByEmailWithPassword: vi.fn(),
  addRefreshTokenAndRole: vi.fn(),
  findUserByIdWithRefreshToken: vi.fn(),
  resetRefreshToken: vi.fn(),
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

vi.mock("jsonwebtoken", ()=> ({
  default: {
    verify: vi.fn()
  }
}))

import { registerUser, loginUser, refreshTokenGenerate, logoutUser } from "../../services/auth.service";
import * as userRepo from "../../repositories/user.repository.js"
import bcrypt from "bcrypt"; 
import { generateAccessToken, generateRefreshToken } from "../../utils/tokenGenerator.js";
import jwt from "jsonwebtoken";

describe("Auth Service - Register", () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockUser = (overrides ={})=> ({
      username: "john",
      email: "john@mail.com",
      password: "123456",
      ...overrides
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

    const result = await registerUser(mockUser())

    // 3️⃣ Assert (verify behavior)
    expect(result).toEqual({
      username: "john",
      email: "john@mail.com"
    })

    expect(userRepo.findOneUser).toHaveBeenCalledWith("john@mail.com","john")

    expect(bcrypt.hash).toHaveBeenCalled()

    expect(userRepo.createUser).toHaveBeenCalledWith(mockUser({password:"hashed123"}))
   })

   it("should throw error if email already exists", async () => {
    userRepo.findOneUser.mockResolvedValue({
      email: "john@mail.com",
      username: "john"
    })

    await expect(registerUser(mockUser())).rejects.toThrow("Email already exists")

    expect(bcrypt.hash).not.toHaveBeenCalled()
    expect(userRepo.createUser).not.toHaveBeenCalled()

  })

    it("should throw error if username already exists", async()=> {
    userRepo.findOneUser.mockResolvedValue({
      email: "john@mail2.com",
      username: "john"
    })

    await expect(registerUser(mockUser())).rejects.toThrow("Username already exists")

    expect(bcrypt.hash).not.toHaveBeenCalled()
    expect(userRepo.createUser).not.toHaveBeenCalled()
  })

  it("should throw error DB down", async()=> {
    userRepo.findOneUser.mockResolvedValue(null)

    bcrypt.hash.mockResolvedValue("hashed123")

    userRepo.createUser.mockRejectedValue(new Error("DB down"))

    await expect(registerUser(mockUser())).rejects.toThrow("DB down")

    expect(userRepo.findOneUser).toHaveBeenCalledTimes(1)

    expect(bcrypt.hash).toHaveBeenCalled()

    expect(userRepo.createUser).toHaveBeenCalledWith(mockUser({password: "hashed123"}))
  })

  it("should throw error hash fail", async ()=> {
    userRepo.findOneUser.mockResolvedValue(null)
    bcrypt.hash.mockRejectedValue(new Error("Hash fail"))

    await expect(registerUser(mockUser())).rejects.toThrow("Hash fail")

    expect(userRepo.findOneUser).toHaveBeenCalledTimes(1)
    expect(bcrypt.hash).toHaveBeenCalled()
    expect(userRepo.createUser).not.toHaveBeenCalled()

  })
})


describe("Auth Service - Login", ()=> {
  beforeEach(()=>{
    vi.clearAllMocks()
  })

  const mockLoginUser = () => ({email: "john@mail.com", password:"123456"})
  const mockFindUserResolved = () => ({_id: "123456789", email: "john@mail.com", password:"hashed123", role:"user"})

  it("should throw error Invalid email or password", async ()=> {
    userRepo.findUserByEmailWithPassword.mockResolvedValue(null)

    await expect(loginUser(mockLoginUser())).rejects.toThrow("Invalid email or password")

    expect(bcrypt.compare).not.toHaveBeenCalled()
    expect(generateAccessToken).not.toHaveBeenCalled()
    expect(generateRefreshToken).not.toHaveBeenCalled()
    expect(userRepo.addRefreshTokenAndRole).not.toHaveBeenCalled()
  })

  it("should throw error Unauthorized", async ()=> {
    userRepo.findUserByEmailWithPassword.mockResolvedValue(mockFindUserResolved())
    bcrypt.compare.mockResolvedValue(false)

    await expect(loginUser(mockLoginUser())).rejects.toThrow("Unauthorized")

    expect(bcrypt.compare).toHaveBeenCalledWith("123456", "hashed123")
    expect(generateAccessToken).not.toHaveBeenCalled()
    expect(generateRefreshToken).not.toHaveBeenCalled()
    expect(userRepo.addRefreshTokenAndRole).not.toHaveBeenCalled()
  })

  it("should login a user successfully", async()=> {
    userRepo.findUserByEmailWithPassword.mockResolvedValue(mockFindUserResolved())
    bcrypt.compare.mockResolvedValue(true)
    generateAccessToken.mockReturnValue("mockAccess")
    generateRefreshToken.mockReturnValue("mockRefresh")
    bcrypt.hash.mockResolvedValue("hashedToken")
    userRepo.addRefreshTokenAndRole.mockResolvedValue()

    const result = await loginUser(mockLoginUser())

    expect(result).toEqual({
      accessToken: "mockAccess",
      refreshToken: "mockRefresh",
    })

    expect(userRepo.findUserByEmailWithPassword).toHaveBeenCalledWith("john@mail.com")
    expect(bcrypt.compare).toHaveBeenCalledWith("123456", "hashed123")
    expect(generateAccessToken).toHaveBeenCalledWith("123456789", "user")
    expect(generateRefreshToken).toHaveBeenCalledWith("123456789", "user")
    expect(bcrypt.hash).toHaveBeenCalled()
    expect(userRepo.addRefreshTokenAndRole).toHaveBeenCalledWith("123456789", "hashedToken", "user")
  })

  it("should throw error when fetching saved user", async()=> {
    userRepo.findUserByEmailWithPassword.mockRejectedValue(new Error("DB down"))

    await expect(loginUser(mockLoginUser())).rejects.toThrow("DB down")

    expect(bcrypt.compare).not.toHaveBeenCalled()
    expect(generateAccessToken).not.toHaveBeenCalled()
    expect(generateRefreshToken).not.toHaveBeenCalled()
    expect(userRepo.addRefreshTokenAndRole).not.toHaveBeenCalled()
  })

  it("should throw error bcrypt compare fail", async()=> {
      userRepo.findUserByEmailWithPassword.mockResolvedValue(mockFindUserResolved())
      bcrypt.compare.mockRejectedValue(new Error("Compare fail"))

      await expect(loginUser(mockLoginUser())).rejects.toThrow("Compare fail")

      expect(userRepo.findUserByEmailWithPassword).toHaveBeenCalledWith("john@mail.com")
      expect(bcrypt.compare).toHaveBeenCalledWith("123456", "hashed123")
      expect(generateAccessToken).not.toHaveBeenCalled()
      expect(generateRefreshToken).not.toHaveBeenCalled()
      expect(userRepo.addRefreshTokenAndRole).not.toHaveBeenCalled()
  })

  it("should throw error hash fail", async()=> {
    userRepo.findUserByEmailWithPassword.mockResolvedValue(mockFindUserResolved())
    bcrypt.compare.mockResolvedValue(true)
    generateAccessToken.mockReturnValue("mockAccess")
    generateRefreshToken.mockReturnValue("mockRefresh")
    bcrypt.hash.mockRejectedValue(new Error("Hash fail"))

    await expect(loginUser(mockLoginUser())).rejects.toThrow("Hash fail")

    expect(userRepo.findUserByEmailWithPassword).toHaveBeenCalledWith("john@mail.com")
    expect(bcrypt.compare).toHaveBeenCalledWith("123456", "hashed123")
    expect(generateAccessToken).toHaveBeenCalledWith("123456789", "user")
    expect(generateRefreshToken).toHaveBeenCalledWith("123456789", "user")
    expect(bcrypt.hash).toHaveBeenCalled()
    expect(userRepo.addRefreshTokenAndRole).not.toHaveBeenCalled()
  })

  it("should throw error when saving refresh token DB down", async ()=> {
    userRepo.findUserByEmailWithPassword.mockResolvedValue(mockFindUserResolved())
    bcrypt.compare.mockResolvedValue(true)
    generateAccessToken.mockReturnValue("mockAccess")
    generateRefreshToken.mockReturnValue("mockRefresh")
    bcrypt.hash.mockResolvedValue("hashedToken")
    userRepo.addRefreshTokenAndRole.mockRejectedValue(new Error("DB down"))

    await expect(loginUser(mockLoginUser())).rejects.toThrow("DB down")

    expect(userRepo.findUserByEmailWithPassword).toHaveBeenCalledWith("john@mail.com")
    expect(bcrypt.compare).toHaveBeenCalledWith("123456", "hashed123")
    expect(generateAccessToken).toHaveBeenCalledWith("123456789", "user")
    expect(generateRefreshToken).toHaveBeenCalledWith("123456789", "user")
    expect(bcrypt.hash).toHaveBeenCalled()
    expect(userRepo.addRefreshTokenAndRole).toHaveBeenCalledWith("123456789", "hashedToken", "user")
  })
})

describe("Auth Service - RefreshToken",()=> {

  beforeEach(()=>{
    vi.clearAllMocks()
    })

  const mockUser =() => ({
    _id:"1234",
    role: "user",
    refreshToken: "hashedToken"
  })
  
  it("should throw error Unauthorized", async()=> {

    await expect(refreshTokenGenerate(null)).rejects.toThrow("Unauthorized")

    expect(jwt.verify).not.toHaveBeenCalled()
    expect(userRepo.findUserByIdWithRefreshToken).not.toHaveBeenCalled()
    expect(bcrypt.compare).not.toHaveBeenCalled()
    expect(generateAccessToken).not.toHaveBeenCalled()
    expect(generateRefreshToken).not.toHaveBeenCalled()
    expect(bcrypt.hash).not.toHaveBeenCalled()
  })

  it("should throw jwt verify error Forbidden", async()=> {
    jwt.verify.mockImplementation(()=> { 
      const error = new Error("JsonWebTokenError");
      error.message= "Forbidden";
      throw error
    })

    await expect(refreshTokenGenerate("token")).rejects.toThrow("Forbidden")

    expect(jwt.verify).toHaveBeenCalledTimes(1)
    expect(userRepo.findUserByIdWithRefreshToken).not.toHaveBeenCalled()
    expect(bcrypt.compare).not.toHaveBeenCalled()
    expect(generateAccessToken).not.toHaveBeenCalled()
    expect(generateRefreshToken).not.toHaveBeenCalled()
    expect(bcrypt.hash).not.toHaveBeenCalled()

  })

  it("should throw error Forbidden when jwt payload is empty", async()=> {
    jwt.verify.mockReturnValue({})
    userRepo.findUserByIdWithRefreshToken.mockResolvedValue(null)

    await expect(refreshTokenGenerate("token")).rejects.toThrow("Forbidden")

    expect(jwt.verify).toHaveBeenCalledTimes(1)
    expect(userRepo.findUserByIdWithRefreshToken).toHaveBeenCalled()
    expect(bcrypt.compare).not.toHaveBeenCalled()
    expect(generateAccessToken).not.toHaveBeenCalled()
    expect(generateRefreshToken).not.toHaveBeenCalled()
    expect(bcrypt.hash).not.toHaveBeenCalled()

  })

  it("should throw user not found error Forbidden", async()=> {
    jwt.verify.mockReturnValue({sub:"1234"})
    userRepo.findUserByIdWithRefreshToken.mockResolvedValue(null)

    await expect(refreshTokenGenerate("token")).rejects.toThrow("Forbidden")

    expect(jwt.verify).toHaveBeenCalledTimes(1)
    expect(userRepo.findUserByIdWithRefreshToken).toHaveBeenCalledWith("1234")
    expect(bcrypt.compare).not.toHaveBeenCalled()
    expect(generateAccessToken).not.toHaveBeenCalled()
    expect(generateRefreshToken).not.toHaveBeenCalled()
    expect(bcrypt.hash).not.toHaveBeenCalled()

  })

  it("should throw while fetching user details error DB down", async()=> {
    jwt.verify.mockReturnValue({sub:"1234"})
    userRepo.findUserByIdWithRefreshToken.mockRejectedValue(new Error("DB down"))

    await expect(refreshTokenGenerate("token")).rejects.toThrow("DB down")

    expect(jwt.verify).toHaveBeenCalledTimes(1)
    expect(userRepo.findUserByIdWithRefreshToken).toHaveBeenCalledWith("1234")
    expect(bcrypt.compare).not.toHaveBeenCalled()
    expect(generateAccessToken).not.toHaveBeenCalled()
    expect(generateRefreshToken).not.toHaveBeenCalled()
    expect(bcrypt.hash).not.toHaveBeenCalled()

  })

  it("should throw bcrypt compare error Refresh token reuse detected. Please login again.", async()=> {
    jwt.verify.mockReturnValue({sub:"1234"})
    userRepo.findUserByIdWithRefreshToken.mockResolvedValue(mockUser())
    bcrypt.compare.mockResolvedValue(false)
    userRepo.addRefreshTokenAndRole.mockResolvedValue()

    await expect(refreshTokenGenerate("token")).rejects.toThrow("Refresh token reuse detected. Please login again.")

    expect(jwt.verify).toHaveBeenCalledTimes(1)
    expect(userRepo.findUserByIdWithRefreshToken).toHaveBeenCalledWith("1234")
    expect(bcrypt.compare).toHaveBeenCalledWith("token", "hashedToken")
    expect(userRepo.addRefreshTokenAndRole).toHaveBeenCalledWith("1234","","user")
    expect(generateAccessToken).not.toHaveBeenCalled()
    expect(generateRefreshToken).not.toHaveBeenCalled()
    expect(bcrypt.hash).not.toHaveBeenCalled()
  })

  it("should throw hash compare error Compare fail", async()=> {
    jwt.verify.mockReturnValue({sub:"1234"})
    userRepo.findUserByIdWithRefreshToken.mockResolvedValue(mockUser())
    bcrypt.compare.mockRejectedValue(new Error("Compare fail"))

    await expect(refreshTokenGenerate("token")).rejects.toThrow("Compare fail")

    expect(jwt.verify).toHaveBeenCalledTimes(1)
    expect(userRepo.findUserByIdWithRefreshToken).toHaveBeenCalledWith("1234")
    expect(bcrypt.compare).toHaveBeenCalledWith("token", "hashedToken")
    expect(generateAccessToken).not.toHaveBeenCalled()
    expect(generateRefreshToken).not.toHaveBeenCalled()
    expect(bcrypt.hash).not.toHaveBeenCalled()
  })

  it("should throw refresh token error hash fail", async()=> {
    jwt.verify.mockReturnValue({sub:"1234"})
    userRepo.findUserByIdWithRefreshToken.mockResolvedValue(mockUser())
    bcrypt.compare.mockResolvedValue(true)
    generateAccessToken.mockReturnValue("mockAccess")
    generateRefreshToken.mockReturnValue("mockRefresh")
    bcrypt.hash.mockRejectedValue(new Error("Hash fail"))

    await expect(refreshTokenGenerate("token")).rejects.toThrow("Hash fail")

    expect(jwt.verify).toHaveBeenCalledTimes(1)
    expect(userRepo.findUserByIdWithRefreshToken).toHaveBeenCalledWith("1234")
    expect(bcrypt.compare).toHaveBeenCalledWith("token", "hashedToken")
    expect(generateAccessToken).toHaveBeenCalledWith("1234", "user")
    expect(generateRefreshToken).toHaveBeenCalledWith("1234", "user")
    expect(bcrypt.hash).toHaveBeenCalled()
  })

  it("should successfully generate new tokens", async()=> {
    jwt.verify.mockReturnValue({sub:"1234"})
    userRepo.findUserByIdWithRefreshToken.mockResolvedValue(mockUser())
    bcrypt.compare.mockResolvedValue(true)
    generateAccessToken.mockReturnValue("mockAccess")
    generateRefreshToken.mockReturnValue("mockRefresh")
    bcrypt.hash.mockResolvedValue("hashedRefresh")
    userRepo.addRefreshTokenAndRole.mockResolvedValue()

    const result = await refreshTokenGenerate("token")

    expect(result).toEqual({
      newAccessToken: "mockAccess",
      newRefreshToken: "mockRefresh"
    })

    expect(jwt.verify).toHaveBeenCalledTimes(1)
    expect(userRepo.findUserByIdWithRefreshToken).toHaveBeenCalledWith("1234")
    expect(bcrypt.compare).toHaveBeenCalledWith("token", "hashedToken")
    expect(generateAccessToken).toHaveBeenCalledWith("1234", "user")
    expect(generateRefreshToken).toHaveBeenCalledWith("1234", "user")
    expect(bcrypt.hash).toHaveBeenCalled()
    expect(userRepo.addRefreshTokenAndRole).toHaveBeenCalledWith("1234","hashedRefresh","user")
  })

})

describe("Auth Service - Logout", ()=> {
  beforeEach(()=> {
    vi.clearAllMocks()
  })

  const mockUser = (overrides={}) => ({_id: "12345", username: "john", email: "john@mail.com", refreshToken: "hashedRefres", ...overrides })

  it("should throw error Unauthorized", async()=>{
    await expect(logoutUser(null)).rejects.toThrow("Unauthorized")

    expect(jwt.verify).not.toHaveBeenCalled()
    expect(userRepo.findUserByIdWithRefreshToken).not.toHaveBeenCalled()
    expect(userRepo.resetRefreshToken).not.toHaveBeenCalled()
  })

  it("should throw jwt verify error Forbidden", async()=> {
    jwt.verify.mockImplementation(()=> { 
      const error = new Error("JsonWebTokenError");
      error.message= "Forbidden";
      throw error
    })

    await expect(logoutUser("token")).rejects.toThrow("Forbidden")

    expect(jwt.verify).toHaveBeenCalledTimes(1)
    expect(userRepo.findUserByIdWithRefreshToken).not.toHaveBeenCalled()
    expect(userRepo.resetRefreshToken).not.toHaveBeenCalled()
  })

  it("should throw user not found error", async()=> {
    jwt.verify.mockReturnValue({sub:"12345"})
    userRepo.findUserByIdWithRefreshToken.mockResolvedValue(null)
    

    await expect(logoutUser("token")).rejects.toThrow("User not found")

    expect(jwt.verify).toHaveBeenCalledTimes(1)
    expect(userRepo.findUserByIdWithRefreshToken).toHaveBeenCalledWith("12345")
    expect(userRepo.resetRefreshToken).not.toHaveBeenCalled()
  })

  it("should throw error DB down when fetching user", async()=> {
    jwt.verify.mockReturnValue({sub:"12345"})
    userRepo.findUserByIdWithRefreshToken.mockRejectedValue(new Error("DB down"))

    await expect(logoutUser("token")).rejects.toThrow("DB down")

    expect(jwt.verify).toHaveBeenCalledTimes(1)
    expect(userRepo.findUserByIdWithRefreshToken).toHaveBeenCalledWith("12345")
    expect(userRepo.resetRefreshToken).not.toHaveBeenCalled()
  })

  it("should throw error DB down when reset Refresh Token", async()=> {
    jwt.verify.mockReturnValue({sub:"12345"})
    userRepo.findUserByIdWithRefreshToken.mockResolvedValue(mockUser())
    userRepo.resetRefreshToken.mockRejectedValue(new Error("DB down"))

    await expect(logoutUser("token")).rejects.toThrow("DB down")

    expect(jwt.verify).toHaveBeenCalledTimes(1)
    expect(userRepo.findUserByIdWithRefreshToken).toHaveBeenCalledWith("12345")
    expect(userRepo.resetRefreshToken).toHaveBeenCalledWith("12345")
  })

  it("should succesfully logout", async()=> {
    jwt.verify.mockReturnValue({sub:"12345"})
    userRepo.findUserByIdWithRefreshToken.mockResolvedValue(mockUser())
    userRepo.resetRefreshToken.mockResolvedValue({username:"john", email:"john@mail.com"})

    const result = await logoutUser("token")
    expect(result).toEqual({message: "User logged out successfully" })

    expect(jwt.verify).toHaveBeenCalledTimes(1)
    expect(userRepo.findUserByIdWithRefreshToken).toHaveBeenCalledWith("12345")
    expect(userRepo.resetRefreshToken).toHaveBeenCalledWith("12345")
  })

  it("should succesfully logout when refresh Token is null", async()=> {
    jwt.verify.mockReturnValue({sub:"12345"})
    userRepo.findUserByIdWithRefreshToken.mockResolvedValue(mockUser({refreshToken: ""}))

    const result = await logoutUser("token")
    expect(result).toEqual({message: "User logged out successfully" })

    expect(jwt.verify).toHaveBeenCalledTimes(1)
    expect(userRepo.findUserByIdWithRefreshToken).toHaveBeenCalledWith("12345")
    expect(userRepo.resetRefreshToken).not.toHaveBeenCalled()
  })
})