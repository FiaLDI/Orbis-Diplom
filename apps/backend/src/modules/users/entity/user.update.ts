import { UserUpdateInfo } from "../types/user.update.info.types";

export class UserUpdate {
    private user: UserUpdateInfo;

    constructor(user: UserUpdateInfo) {
        this.user = user;
    }

    toJSON() {
        const u = this.user;
        const p = u.user_profile;

        return {
            id: u.id,
            email: u.email,
            username: u.username,
            number: u.number ?? null,
            avatar_url: p?.avatar_url ?? null,
            about: p?.about ?? null,
            first_name: p?.first_name ?? null,
            last_name: p?.last_name ?? null,
            birth_date: p?.birth_date ?? null,
            gender: p?.gender ?? null,
            location: p?.location ?? null,
        };
    }
}
