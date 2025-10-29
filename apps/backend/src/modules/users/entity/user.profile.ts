import { Prisma } from "@prisma/client";

export class UserProfile {
  constructor(
    private user: Prisma.usersGetPayload<{
      include: {
        user_profile: true;
        user_preferences: true;
        blocks_initiated: true;
        blocks_received: true;
      };
    }>
  ) {}

  static getUsersMap(profiles: UserProfile[]): Map<number, UserProfile> {
    const map = new Map<number, UserProfile>();
    for (const p of profiles) map.set(p.user.id, p);
    return map;
  }

  toJSON() {
    const u = this.user;
    return {
      id: u.id,
      email: u.email,
      username: u.username,
      number: u.number,
      avatar_url: u.user_profile?.avatar_url ?? null,
      about: u.user_profile?.about ?? null,
      first_name: u.user_profile?.first_name ?? null,
      last_name: u.user_profile?.last_name ?? null,
      birth_date: u.user_profile?.birth_date ?? null,
      gender: u.user_profile?.gender ?? null,
      location: u.user_profile?.location ?? null,
      preferences: u.user_preferences ?? null,
      blocked_users: u.blocks_initiated.map(b => b.blocked_user_id),
      blocked_by_users: u.blocks_received.map(b => b.id_users),
    };
  }

  toPublicJSON() {
    const u = this.user;
    return {
      id: u.id,
      username: u.username,
      avatar_url: u.user_profile?.avatar_url ?? null,
      about: u.user_profile?.about ?? null,
      first_name: u.user_profile?.first_name ?? null,
      last_name: u.user_profile?.last_name ?? null,
      birth_date: u.user_profile?.birth_date ?? null,
      gender: u.user_profile?.gender ?? null,
      location: u.user_profile?.location ?? null,
      is_online: u.user_profile?.is_online ?? false,
    };
  }

  getRaw() {
    return this.user;
  }

  isBlockedBy(userId: number) {
    return this.user.blocks_received.some(b => b.id_users === userId);
  }

  hasBlocked(userId: number) {
    return this.user.blocks_initiated.some(b => b.blocked_user_id === userId);
  }
}
