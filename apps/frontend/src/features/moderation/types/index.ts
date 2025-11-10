export interface AuditLog {
    id: string;
    server_id: string;
    actor_id: string;
    action: string;
    target_id?: string;
    metadata?: string;
    created_at: string;
    actor?: { id: string; username?: string };
}
