import { useSelector, type TypedUseSelectorHook } from "react-redux";
import type { RootState } from "../store";

/**
 * Custom hook to use the Redux selector with correct typing
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
