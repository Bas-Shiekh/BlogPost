import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";

/**
 * Custom hook to use the Redux dispatch function with correct typing
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();
