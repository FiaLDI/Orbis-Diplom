/*
  Warnings:

  - The `priority` column on the `issue` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "IssuePriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- AlterTable
ALTER TABLE "issue" ADD COLUMN     "due_date" TIMESTAMP(3),
ADD COLUMN     "parent_id" INTEGER,
DROP COLUMN "priority",
ADD COLUMN     "priority" "IssuePriority" NOT NULL DEFAULT 'MEDIUM';

-- AddForeignKey
ALTER TABLE "issue" ADD CONSTRAINT "issue_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "issue"("id") ON DELETE SET NULL ON UPDATE CASCADE;
