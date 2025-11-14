import React from "react";
import { CirclePlus } from "lucide-react";
import { SearchFriendModal } from "./SearchFriendModal";
import { useSearchFriendsModel } from "../../hooks";

export const Component: React.FC = () => {
  const m = useSearchFriendsModel();

  return (
    <>
      <button onClick={() => m.setOpen(true)} className="cursor-pointer">
        <CirclePlus
          color="white"
          className="w-15 h-15 lg:w-8 lg:h-8"
          strokeWidth="1.25"
        />
      </button>

      <SearchFriendModal
        open={m.open}
        onClose={() => m.setOpen(false)}
        find={m.find}
        handleChange={m.handleChange}
        results={m.results}
        onMessage={(id) => m.startChatting(id)}
        onInvite={(id) => m.inviteFriend(id)}
      />
    </>
  );
};
