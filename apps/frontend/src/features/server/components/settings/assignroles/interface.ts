
export interface ComponentProps {
  userId: number;
  serverId: number;
  availableRoles: { id: number; name: string; color?: string }[];
  userRoles: { id: number; name: string }[];
}
