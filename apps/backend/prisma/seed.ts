import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
     const permissions = [
    "ADMIN",
    "MANAGE_SERVER",
    "MANAGE_ROLES",
    "MANAGE_CHANNELS",
    "VIEW_AUDIT_LOGS",
    "KICK_USERS",
    "BAN_USERS",
    "UNBAN_USERS",
    "MUTE_USERS",
    "MANAGE_MESSAGES",
    "SEND_MESSAGES",
    "ATTACH_FILES",
    "MANAGE_INVITES",
    "CHANGE_NICKNAME",
    "MANAGE_NICKNAMES",
    "VIEW_CHANNEL",
  ];

for (const perm of permissions) {
    await prisma.permission_type.upsert({
      where: { name: perm },
      update: {},
      create: { name: perm },
    });
  }
}

main().finally(() => prisma.$disconnect());
