import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/**
 * Toast interface
 */
export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

/**
 * Toast state interface
 */
interface ToastState {
  toasts: Toast[];
}

/**
 * Initial toast state
 */
const initialState: ToastState = {
  toasts: [],
};

/**
 * Generate unique ID for toasts
 */
let toastId = 0;
const generateId = () => {
  toastId = (toastId + 1) % Number.MAX_SAFE_INTEGER;
  return toastId.toString();
};

/**
 * Toast slice for Redux
 */
const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Omit<Toast, "id">>) => {
      const id = generateId();
      state.toasts.push({ id, ...action.payload });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(
        (toast) => toast.id !== action.payload
      );
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const { addToast, removeToast, clearToasts } = toastSlice.actions;
export default toastSlice.reducer;
