import React, { useCallback } from "react";
import { useLazyGetChatsUsersQuery } from "@/features/user/api";

export function useUserData(userId?: string) {
  const [getPersonalChats] = useLazyGetChatsUsersQuery();

  const fetchUserData = useCallback(async () => {
    if (!userId) return;

    await Promise.all([getPersonalChats({})]);
  }, [userId]);

  React.useEffect(() => {
    if (!userId) return;
    fetchUserData();
  }, [userId, fetchUserData]);
}
