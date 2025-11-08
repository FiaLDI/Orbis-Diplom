import { PrismaClient } from "@prisma/client";

export async function getServer(prisma: PrismaClient, serverId: string) {
    return prisma.servers.findFirst({
        select: { id: true, name: true },
        where: { id: serverId },
    });
}
