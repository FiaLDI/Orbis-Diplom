export interface AuditLog {
    id: number;
    server_id: number;
    actor_id: number;
    action: string;
    target_id?: string;
    metadata?: string;
    created_at: string;
    actor?: { id: number; username?: string };
}
