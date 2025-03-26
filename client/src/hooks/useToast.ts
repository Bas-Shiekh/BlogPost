"use client";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import {
  addToast,
  removeToast,
  clearToasts,
  type Toast,
} from "../store/slices/toastSlice";

/**
 * Hook for using toast functionality with Redux
 */
export const useToast = () => {
  const dispatch = useDispatch();
  const { toasts } = useSelector((state: RootState) => state.toast);

  const toast = (props: Omit<Toast, "id">) => {
    dispatch(addToast(props));

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      const toastList = toasts;
      if (toastList.length > 0) {
        dispatch(removeToast(toastList[toastList.length - 1].id));
      }
    }, 5000);
  };

  const dismiss = (toastId?: string) => {
    if (toastId) {
      dispatch(removeToast(toastId));
    } else {
      dispatch(clearToasts());
    }
  };

  return {
    toast,
    dismiss,
    toasts,
  };
}
