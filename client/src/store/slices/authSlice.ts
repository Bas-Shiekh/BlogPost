import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { authApi, type LoginData, type SignupData } from "../../lib/auth-api";
import type { User } from "../../lib/types";
import { addToast } from "./toastSlice";

/**
 * Auth state interface
 */
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Initial auth state
 */
const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
  error: null,
};

/**
 * Login async thunk
 */
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginData, { rejectWithValue, dispatch }) => {
    try {
      const response = await authApi.login(credentials);

      // Extract user data without password
      const userData: User = {
        id: response.userInfo.id,
        name: response.userInfo.name,
        email: response.userInfo.email,
      };

      // Store token and user data in localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(userData));

      // Show success toast
      dispatch(
        addToast({
          title: "Login successful",
          description:
            response.message || "You have been logged in successfully",
        })
      );

      return userData;
    } catch (error: any) {
      // Show error toast
      dispatch(
        addToast({
          title: "Login failed",
          description:
            error.response?.data?.message ||
            "Please check your credentials and try again",
          variant: "destructive",
        })
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  }
);

/**
 * Register async thunk
 */
export const register = createAsyncThunk(
  "auth/register",
  async (userData: SignupData, { rejectWithValue, dispatch }) => {
    try {
      const response = await authApi.signup(userData);

      // Extract user data
      const user: User = {
        id: response.userInfo.id,
        name: response.userInfo.name,
        email: response.userInfo.email,
      };

      // Store token and user data in localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(user));

      // Show success toast
      dispatch(
        addToast({
          title: "Registration successful",
          description:
            response.message || "Your account has been created successfully",
        })
      );

      return user;
    } catch (error: any) {
      // Show error toast
      dispatch(
        addToast({
          title: "Registration failed",
          description:
            error.response?.data?.message ||
            "Please check your information and try again",
          variant: "destructive",
        })
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Registration failed. Please check your information."
      );
    }
  }
);

/**
 * Logout async thunk
 */
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await authApi.logout();

      // Clear token and user data from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Show success toast
      dispatch(
        addToast({
          title: "Logout successful",
          description: "You have been logged out successfully",
        })
      );

      return null;
    } catch (error: any) {
      // Show error toast
      dispatch(
        addToast({
          title: "Logout failed",
          description:
            error.response?.data?.message || "An error occurred during logout",
          variant: "destructive",
        })
      );

      // Still clear local data even if API call fails
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return rejectWithValue(error.response?.data?.message || "Logout failed.");
    }
  }
);

/**
 * Get current user async thunk
 */
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      // Check if we have a token
      const token = localStorage.getItem("token");
      if (!token) {
        return null;
      }

      const userData = await authApi.getCurrentUser();

      // Create a user object without the password
      const safeUserData: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
      };

      // Update localStorage with fresh user data
      localStorage.setItem("user", JSON.stringify(safeUserData));

      return safeUserData;
    } catch (error: any) {
      // Clear invalid token
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user data."
      );
    }
  }
);

/**
 * Auth slice for Redux
 */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Register
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      register.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      }
    );
    builder.addCase(register.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Logout
    builder.addCase(logout.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.isLoading = false;
      state.user = null;
      state.isAuthenticated = false;
    });
    builder.addCase(logout.rejected, (state) => {
      state.isLoading = false;
      state.user = null;
      state.isAuthenticated = false;
    });

    // Get Current User
    builder.addCase(getCurrentUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      getCurrentUser.fulfilled,
      (state, action: PayloadAction<User | null>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      }
    );
    builder.addCase(getCurrentUser.rejected, (state, action) => {
      state.isLoading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
