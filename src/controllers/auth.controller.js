import { prisma } from "../config/db.config.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/tokenGen.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, passwordHash } = req.body;

    // Validate input - provide specific error messages
    if (!firstName) return res.status(400).json({ message: "firstName is required" });
    if (!lastName) return res.status(400).json({ message: "lastName is required" });
    if (!email) return res.status(400).json({ message: "email is required" });
    if (!phone) return res.status(400).json({ message: "phone is required" });
    if (!passwordHash) return res.status(400).json({ message: "password is required" });

    // Check Existing User
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwordHash, salt);

    // Create User
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        passwordHash: hashedPassword,
      },
    });

    return res.status(201).json({ message: "User Created Successfully", userId: user.id });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, passwordHash } = req.body;

    // Validate input
    if (!email) return res.status(400).json({ message: "email is required" });
    if (!passwordHash) return res.status(400).json({ message: "password is required" });

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!existingUser) {
        return res.status(401).json({ error: "Invalid Credentials" });
    }

    // Verify Password
    const isPasswordValid = await bcrypt.compare(passwordHash, existingUser.passwordHash);
    if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid Credentials" });
    }

    // Generate Token
    const token = generateToken(existingUser.id, res);

    return res.status(200).json({
        message: "Login Successful", token
    });
  } catch (error) {
    console.error("Login error:", error);
    console.log("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    });

    return res.status(200).json({
        message: "Logged Out Successfully",
    });
};