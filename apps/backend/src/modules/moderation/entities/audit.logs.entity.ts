import { UserProfile } from "@/modules/users/entity/user.profile";
import type { Prisma } from "@prisma/client";

export class AuditLogsEntity {
    constructor(
        private auditLogs: Prisma.audit_logsGetPayload<{}>[],
        private serverData: {
            name: string;
            id: string;
        } | null
    ) {}

    getActorIds() {
        return [...new Set(this.auditLogs.map((l) => l.actor_id).filter(Boolean))];
    }

    getTargetIds() {
        return [...new Set(this.auditLogs.map((l) => l.target_id).filter(Boolean))];
    }

    toJSON(ActorProfileMap: Map<string, UserProfile>, TargetProfileMap: Map<string, UserProfile>) {
        return this.auditLogs.map((l) => {
            if (!this.serverData) return null;
            const ActorProfile = ActorProfileMap.get(l.actor_id ?? "");
            if (!ActorProfile) return null;

            const TargetProfile = TargetProfileMap.get(l.target_id ?? "");
            if (!TargetProfile) return null;

            return {
                id: l.id,
                serverId: l.server_id,
                actorId: l.actor_id,
                targetId: l.target_id,
                action: l.action,
                metadata: l.metadata,
                createdAt: l.created_at,
                serverName: this.serverData.name,
                actorName: ActorProfile.toPublicJSON().username,
                targetName: TargetProfile.toPublicJSON().username,
            };
        });
    }
}
