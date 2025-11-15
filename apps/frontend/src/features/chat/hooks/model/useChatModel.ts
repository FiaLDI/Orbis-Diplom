import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setActiveChat } from "@/features/chat/slice";

export function useChatModel() {
  const activeChat = useAppSelector((state) => state.chat.activeChat);
  const dispatch = useAppDispatch();

  const closeChat = () => {
    dispatch(setActiveChat(undefined));
  };

  return {
    closeChat,
    activeChat,
  };
}
