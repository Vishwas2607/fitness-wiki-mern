import {describe, it, expect, vi, beforeEach} from "vitest";

vi.mock("../../repositories/user.repository.js", ()=> ({
  findOneUser: vi.fn(),
  createUser: vi.fn(),
}))

vi.mock("bcrypt", ()=> ({
  default: {
    hash:vi.fn()
  }
}))

import { registerUser } from "../../services/auth.service";
import * as userRepo from "../../repositories/user.repository.js"
import bcrypt from "bcrypt"; 

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