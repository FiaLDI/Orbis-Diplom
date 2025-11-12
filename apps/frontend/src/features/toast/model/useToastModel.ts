import { selectToasts, removeToast, selectToastPosition } from "@/features/toast/slice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

export function useToastModel() {
    const toasts = useAppSelector(selectToasts);
    const position = useAppSelector(selectToastPosition);
    const dispatch = useAppDispatch();

    const removeToastHandler = (id: string) => {
        dispatch(removeToast(id));
    };

    return {
        toasts,
        position,
        removeToastHandler,
    };
}
