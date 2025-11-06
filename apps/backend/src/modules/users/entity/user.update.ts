import { Prisma } from "@prisma/client";

export class UserUpdate {
    private user: Prisma.usersGetPayload<{
        include: { user_profile: true };
    }>;

    constructor(user: Prisma.usersGetPayload<{ include: { user_profile: true } }>) {
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
