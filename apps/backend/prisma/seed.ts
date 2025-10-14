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
    "VIEW_CHANNEL",
  ];

  for (const perm of permissions) {
      await prisma.permission_type.upsert({
        where: { name: perm },
        update: {},
        create: { name: perm },
      });
    }
  
  const statuses = ["Open", "In Progress", "Review", "Done", "Closed"];

  for (const status of statuses) {
    await prisma.issue_status.upsert({
      where: { name: status },
      update: {},
      create: { name: status },
    });
  }
}

main().finally(() => prisma.$disconnect());
