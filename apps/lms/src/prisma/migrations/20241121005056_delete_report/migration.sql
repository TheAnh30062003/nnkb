/*
  Warnings:

  - You are about to drop the `report` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "report" DROP CONSTRAINT "report_taskId_fkey";

-- DropTable
DROP TABLE "report";
