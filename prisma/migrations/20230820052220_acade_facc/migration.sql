/*
  Warnings:

  - Added the required column `academicDepartmentId` to the `faculties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `academicFacultyId` to the `faculties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `academicDepartmentId` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `academicFacultyId` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `academicSemesterId` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "faculties" ADD COLUMN     "academicDepartmentId" TEXT NOT NULL,
ADD COLUMN     "academicFacultyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "academicDepartmentId" TEXT NOT NULL,
ADD COLUMN     "academicFacultyId" TEXT NOT NULL,
ADD COLUMN     "academicSemesterId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_academicSemesterId_fkey" FOREIGN KEY ("academicSemesterId") REFERENCES "academic_semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_academicDepartmentId_fkey" FOREIGN KEY ("academicDepartmentId") REFERENCES "academic_departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_academicFacultyId_fkey" FOREIGN KEY ("academicFacultyId") REFERENCES "academic_faculties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculties" ADD CONSTRAINT "faculties_academicDepartmentId_fkey" FOREIGN KEY ("academicDepartmentId") REFERENCES "academic_departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculties" ADD CONSTRAINT "faculties_academicFacultyId_fkey" FOREIGN KEY ("academicFacultyId") REFERENCES "academic_faculties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
