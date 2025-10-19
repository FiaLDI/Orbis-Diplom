/*
  Warnings:

  - You are about to drop the column `role_id` on the `user_server` table. All the data in the column will be lost.
  - Added the required column `server_id` to the `role_server` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."user_server" DROP CONSTRAINT "user_server_role_id_fkey";

-- DropIndex
DROP INDEX "public"."user_server_role_id_idx";

-- AlterTable
ALTER TABLE "role_server" ADD COLUMN     "server_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user_server" DROP COLUMN "role_id";

-- CreateTable
CREATE TABLE "user_server_roles" (
    "user_id" INTEGER NOT NULL,
    "server_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "user_server_roles_pkey" PRIMARY KEY ("user_id","server_id","role_id")
);

-- CreateIndex
CREATE INDEX "user_server_roles_role_id_idx" ON "user_server_roles"("role_id");

-- CreateIndex
CREATE INDEX "role_server_server_id_idx" ON "role_server"("server_id");

-- AddForeignKey
ALTER TABLE "role_server" ADD CONSTRAINT "role_server_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_server_roles" ADD CONSTRAINT "user_server_roles_user_id_server_id_fkey" FOREIGN KEY ("user_id", "server_id") REFERENCES "user_server"("user_id", "server_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_server_roles" ADD CONSTRAINT "user_server_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role_server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
