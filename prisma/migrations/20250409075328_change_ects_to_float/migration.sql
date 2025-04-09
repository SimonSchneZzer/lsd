/*
  Warnings:

  - You are about to alter the column `ects` on the `Course` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "lessonUnits" INTEGER NOT NULL,
    "ects" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Course" ("courseId", "createdAt", "ects", "id", "lessonUnits", "summary", "updatedAt") SELECT "courseId", "createdAt", "ects", "id", "lessonUnits", "summary", "updatedAt" FROM "Course";
DROP TABLE "Course";
ALTER TABLE "new_Course" RENAME TO "Course";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
