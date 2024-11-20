-- CreateTable
CREATE TABLE "report" (
    "id" SERIAL NOT NULL,
    "taskId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
