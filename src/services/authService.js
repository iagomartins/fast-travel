import api from "./api";
import { SessionStorage } from "quasar";

/**
 * Authenticate with API to get session token
 */
export async function authenticate() {
  try {
    const response = await api.post("/api/authenticate", {
      email: process.env.API_USER,
      password: process.env.API_PASSWORD,
    });
    SessionStorage.set("session_key", response.data.data.token);
    return response.data;
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
}

/**
 * User login
 */
export async function login(email, password) {
  try {
    const response = await api.post("/api/v1/userLogin", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

/**
 * Create new user account
 */
export async function createUser(userData) {
  try {
    const response = await api.post("/api/v1/users", {
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });
    return response.data;
  } catch (error) {
    console.error("Create user error:", error);
    throw error;
  }
}
