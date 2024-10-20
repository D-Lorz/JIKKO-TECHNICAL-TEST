/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Library` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "BookStatus" AS ENUM ('AVAILABLE', 'BORROWED');

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "borrowedById" TEXT,
ADD COLUMN     "status" "BookStatus" NOT NULL DEFAULT 'AVAILABLE';

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Library_name_key" ON "Library"("name");

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_borrowedById_fkey" FOREIGN KEY ("borrowedById") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
