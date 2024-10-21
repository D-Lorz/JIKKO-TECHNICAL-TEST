/*
  Warnings:

  - You are about to drop the column `memberId` on the `Member` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[membershipCode]` on the table `Member` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `membershipCode` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Member_memberId_key";

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "memberId",
ADD COLUMN     "membershipCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Member_membershipCode_key" ON "Member"("membershipCode");
