import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const perms = [
        "MANAGE_CHANNELS",
        "MANAGE_ROLES",
        "KICK_MEMBERS",
        "BAN_MEMBERS",
        "INVITES_CREATE",
    ];

    for (const p of perms) {
        await prisma.permission_type.upsert({
            where: { name: p },
            update: {},
            create: { name: p },
        });
    }
}

main().finally(() => prisma.$disconnect());
