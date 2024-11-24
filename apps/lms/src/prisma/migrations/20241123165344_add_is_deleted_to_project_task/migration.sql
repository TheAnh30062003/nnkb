-- AlterTable
ALTER TABLE "project_task" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "user_project_task" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
