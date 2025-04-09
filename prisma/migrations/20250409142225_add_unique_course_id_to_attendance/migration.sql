/*
  Warnings:

  - A unique constraint covering the columns `[courseId]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Attendance_courseId_key" ON "Attendance"("courseId");
