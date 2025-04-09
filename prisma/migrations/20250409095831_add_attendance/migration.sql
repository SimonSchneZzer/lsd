-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "totalLessonUnits" INTEGER NOT NULL,
    "missedLessonUnits" INTEGER NOT NULL,
    "progress" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
