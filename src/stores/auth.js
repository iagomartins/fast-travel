import { defineStore } from "pinia";
import { SessionStorage } from "quasar";
import * as authService from "src/services/authService";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    isAuthenticated: false,
    userType: null,
    isLoading: false,
  }),

  getters: {
    isAdmin: (state) => state.userType === "adm",
    currentUser: (state) => state.user,
  },

  actions: {
    async authenticate() {
      try {
        await authService.authenticate();
      } catch (error) {
        console.error("Authentication failed:", error);
        throw error;
      }
    },

    async login(email, password) {
      this.isLoading = true;
      try {
        const response = await authService.login(email, password);
        // New API structure: { success: true, data: { user: {...} }, message: "...", status_code: 200 }
        const userData = response.data?.user;
        if (!userData) {
          throw new Error("User data not found in response");
        }

        // Create a plain object to avoid Proxy/reactive issues
        const user = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          created_at: userData.created_at,
          updated_at: userData.updated_at,
        };

        // Safely extract id
        const userId = Number(user.id);

        if (!userId || isNaN(userId)) {
          console.error("Invalid user ID:", user.id);
          throw new Error("Invalid user ID in response");
        }

        this.user = user;
        this.userType = userId === 1 ? "adm" : "user";
        this.isAuthenticated = true;

        SessionStorage.set("user_id", userId);
        SessionStorage.set("user_type", this.userType);
        SessionStorage.set("user", email);

        return response;
      } catch (error) {
        this.isAuthenticated = false;
        this.user = null;
        this.userType = null;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async createUser(userData) {
      this.isLoading = true;
      try {
        const response = await authService.createUser(userData);
        return response;
      } catch (error) {
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    logout() {
      this.user = null;
      this.isAuthenticated = false;
      this.userType = null;
      SessionStorage.clear();
    },

    initAuth() {
      const userId = SessionStorage.getItem("user_id");
      const userType = SessionStorage.getItem("user_type");
      const user = SessionStorage.getItem("user");

      if (userId && userType) {
        this.isAuthenticated = true;
        this.userType = userType;
        this.user = { email: user, id: userId };
      }
    },
  },
});
