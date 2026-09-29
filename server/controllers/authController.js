import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

/*
    Register User
    POST /api/auth/register
*/

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check empty fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate Token
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studyGoal: user.studyGoal,
        dailyTargetHours: user.dailyTargetHours,
        streak: user.streak,
      },
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/*
    Login User
    POST /api/auth/login
*/

export const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    // Get password also
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // Compare Password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // Generate JWT
    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studyGoal: user.studyGoal,
        dailyTargetHours: user.dailyTargetHours,
        streak: user.streak,
      },
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

/*
    Logout User
    POST /api/auth/logout
*/

export const logout = async (req, res) => {

  return res.status(200).json({
    success: true,
    message: "Logout Successful",
  });

};

/*
    Current Logged In User
    GET /api/auth/me
*/

export const getCurrentUser = async (req, res) => {

  return res.status(200).json({
    success: true,
    user: req.user,
  });

};

// PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name", "bio", "college", "branch", "semester", "profileImage",
      "socialLinks", "preferences",
    ];
    const updates = Object.fromEntries(
      allowedFields
        .filter((field) => req.body[field] !== undefined)
        .map((field) => [field, req.body[field]]),
    );

    if (updates.name !== undefined && !String(updates.name).trim()) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, message: "Profile updated", user });
  } catch (error) {
    return res.status(error.name === "ValidationError" ? 400 : 500).json({
      success: false,
      message: error.message || "Unable to update profile",
    });
  }
};

//google authentication


const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);

export const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                success: false,
                message: "Google credential is required"
            });
        }

        // Verify Google ID Token
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        const {
            sub: googleId,
            name,
            email,
            picture
        } = payload;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Google account email not found"
            });
        }

        // Find existing user
        let user = await User.findOne({ email });

        // If user doesn't exist, create one
        if (!user) {
            user = await User.create({
                name,
                email,
                googleId,
                profileImage: picture
            });
        } 
        else {
            // Existing user
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
        }

        // Generate your application's JWT
        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Google Login Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage
            }
        });

    } catch (error) {

        console.error("Google Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Google authentication failed"
        });
    }
};
