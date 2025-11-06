/*
  Warnings:

  - The primary key for the `users_blocks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id_users,blocked_user_id]` on the table `users_blocks` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `blocked_user_id` to the `users_blocks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users_blocks" DROP CONSTRAINT "users_blocks_pkey",
ADD COLUMN     "blocked_user_id" INTEGER NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "users_blocks_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_blocks_id_users_blocked_user_id_key" ON "users_blocks"("id_users", "blocked_user_id");

-- AddForeignKey
ALTER TABLE "users_blocks" ADD CONSTRAINT "users_blocks_blocked_user_id_fkey" FOREIGN KEY ("blocked_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
