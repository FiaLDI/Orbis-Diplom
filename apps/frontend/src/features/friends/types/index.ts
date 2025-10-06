import { UserInfo } from "@/features/user";

export type ModeKeys = "Online" | "Offline" | "All" | "Invite" | "My Invite";
export type ModeState = Record<ModeKeys, boolean>;

export type friendState = {
    friendsMode: ModeKeys;
    friends: UserInfo[];
    isSearchActive?: boolean;
}
