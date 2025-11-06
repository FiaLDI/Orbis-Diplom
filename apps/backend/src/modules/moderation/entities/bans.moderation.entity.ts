import { UserProfile } from "@/modules/users/entity/user.profile";
import type { Prisma } from "@prisma/client";

export class BansEntity {
    constructor(
        private bans: Prisma.server_bansGetPayload<{}>[],
        private serverData: {
            name: string;
            id: number;
        } | null
    ) {}

    getActorIds() {
        return [...new Set(this.bans.map((l) => l.banned_by).filter(Boolean))];
    }

    getTargetIds() {
        return [...new Set(this.bans.map((l) => Number(l.user_id)).filter(Boolean))];
    }

    toJSON(ActorProfileMap: Map<number, UserProfile>, TargetProfileMap: Map<number, UserProfile>) {
        return this.bans.map((b) => {
            if (!this.serverData) return null;
            const ActorProfile = ActorProfileMap.get(b.banned_by ?? -1);
            if (!ActorProfile) return null;

            const TargetProfile = TargetProfileMap.get(Number(b.user_id) ?? -1);
            if (!TargetProfile) return null;

            return {
                serverId: b.server_id,
                actorId: b.banned_by,
                targetId: b.user_id,
                reason: b.reason,
                avatarUrl: TargetProfile.toPublicJSON().avatar_url,
                createdAt: b.created_at,
                serverName: this.serverData.name,
                actorName: ActorProfile.toPublicJSON().username,
                targetName: TargetProfile.toPublicJSON().username,
            };
        });
    }
}
