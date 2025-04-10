/*
  Warnings:

  - A unique constraint covering the columns `[userId,courseId]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `Attendance` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_userId_fkey";

-- DropIndex
DROP INDEX "Attendance_courseId_key";

-- AlterTable
ALTER TABLE "Attendance" ALTER COLUMN "userId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_userId_courseId_key" ON "Attendance"("userId", "courseId");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
