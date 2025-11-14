// src/features/friends/model/useSearchFriendsModel.ts
import { useState, useRef, useCallback, useEffect } from "react";
import {
  useLazyGetUserbyNameQuery,
  useStartChattingMutation,
} from "@/features/user";
import { useSendRequestMutation } from "../../api";
import { useAppSelector } from "@/app/hooks";

export function useSearchFriendsModel() {
  const [open, setOpen] = useState(false);
  const [find, setFind] = useState("");
  const timerRef = useRef<NodeJS.Timeout>();
  const [trigger, { data }] = useLazyGetUserbyNameQuery();
  const [startChatting] = useStartChattingMutation();
  const [inviteFriend] = useSendRequestMutation();
  const myId = useAppSelector((s) => s.auth.user?.info.id);

  const debounce = useCallback((value: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      trigger(value);
    }, 500);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFind(value);
    debounce(value);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const results = data?.data?.filter((u: any) => u.id !== myId) || [];

  return {
    open,
    setOpen,
    find,
    setFind,
    handleChange,
    results,
    startChatting,
    inviteFriend,
  };
}
