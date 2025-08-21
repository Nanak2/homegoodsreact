// routes/auth.js
import express from "express";
import supabaseService from "../config/supabaseClient.js"; // service-role client
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const router = express.Router();

const signAppToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

//console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
//console.log("SUPABASE_SERVICE_ROLE_KEY length:", process.env.SUPABASE_SERVICE_ROLE_KEY?.length);

// Fetch user by email using Supabase Admin API
const fetchAuthUserByEmail = async (email) => {
  const { data, error } = await supabaseService
    .rpc('get_user_id_by_email', { email });

  if (error) {
    console.error('RPC error:', error);
    throw error;
  }
  return Array.isArray(data) && data.length > 0;
};

// Create auth user via admin API (service role)
const createAuthUser = async (email, password,) => {
  const { data, error } = await supabaseService.auth.admin.createUser({
    email,
    password, // admin will store/ hash password securely
    email_confirm: true,
    //user_metadata: { username: userName },
  });  
  if (error) {
    console.error("Error creating auth user:", error);
    throw error;
  }  
  return data;
}

// ------------------ SIGNUP ------------------
// Creates an auth user using the admin API and returns an app JWT
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password ) return res.status(400).json({ message: "Missing fields" });

  console.log("Email:", email);

  try {
    // If user exists in auth.users, reject
    const existing = await fetchAuthUserByEmail(email);
    if (existing) return res.status(400).json({ message: "Email already in use" });

    const newUser = await createAuthUser(email, password);
    if (!newUser) return res.status(500).json({ message: "Failed to create user" });

    console.log("New user created:", newUser);
    console.log("New user ID:", newUser.user.id);
    console.log("New user email:", newUser.user.email);
    console.log("New user metadata:", newUser.user.user_metadata);

    // Sign app token
    const token = signAppToken({ userID: newUser.user.id });

    res.status(201).json({
      message: "Signup successful",
      userID: newUser.user.id,
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// ------------------ LOGIN ------------------
// Use Supabase token endpoint (grant_type=password) to authenticate and get user info.
// Returns an app JWT (server-signed) for your API use.
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const { data, error } = await supabaseService.auth.signInWithPassword({
      email,
      password
    });

    console.log("Email:",email);

    if (error) {
      console.error("Supabase login error:", error);
      return res.status(401).json({ message: error.message });
    }

    const { user, session } = data;
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("Here inside auth.js");

    // user has id, email, user_metadata
    //const username = user.user_metadata?.username ?? user.email;

    // Sign your app’s own JWT
    const appToken = signAppToken({ userID: user.id });

    res.status(200).json({
      message: "Login successful",
      userID: user.id,
      token: appToken,
      supabase_access_token: session.access_token,
      supabase_refresh_token: session.refresh_token
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
