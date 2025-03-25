import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { removeToast } from "../../store/slices/toastSlice";
import { Toast, ToastTitle, ToastDescription, ToastViewport } from "./Toast";

/**
 * Toaster component that displays toasts from Redux state
 */
export function Toaster() {
  const dispatch = useDispatch();
  const { toasts } = useSelector((state: RootState) => state.toast);

  return (
    <ToastViewport>
      {toasts.map(({ id, title, description, variant }) => (
        <Toast
          key={id}
          variant={variant}
          onOpenChange={(open) => {
            if (!open) dispatch(removeToast(id));
          }}
        >
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
        </Toast>
      ))}
    </ToastViewport>
  );
}
