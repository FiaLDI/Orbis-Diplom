import { UserProfile } from "@/modules/users/entity/user.profile";
import type { RoleServerWithRelations } from "../types/roles.server.types";

export class RolesServer {
    constructor(
        private roles: RoleServerWithRelations[],
        private profiles: UserProfile[]
    ) {}

    toJSON() {
        const profileMap = new Map(this.profiles.map((p) => [p.toJSON().id, p.toJSON()]));

        return this.roles.map((r) => ({
            id: r.id,
            name: r.name,
            color: r.color,
            permissions: r.role_permission.map((rp) => rp.permission.name),
            members: r.members.map((m) => {
                const userId = m.user_server.user_id;
                const profile = userId ? profileMap.get(userId) : null;

                return {
                    userId,
                    username: profile?.username ?? null,
                    avatarUrl: profile?.avatar_url ?? null,
                };
            }),
        }));
    }
}
