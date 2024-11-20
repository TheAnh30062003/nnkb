-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('INACTIVE', 'ACTIVE', 'PENDING');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(255),
    "last_name" VARCHAR(255),
    "avatar_url" VARCHAR(255),
    "password" VARCHAR(255) NOT NULL,
    "dob" DATE,
    "role" "Role" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_by" TEXT,
    "modified_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_by" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "refresh_otp" TEXT,
    "reset_otp" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "token_id_key" ON "token"("id");

-- CreateIndex
CREATE UNIQUE INDEX "token_user_id_key" ON "token"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "token_refresh_otp_key" ON "token"("refresh_otp");

-- CreateIndex
CREATE UNIQUE INDEX "token_reset_otp_key" ON "token"("reset_otp");

-- AddForeignKey
ALTER TABLE "token" ADD CONSTRAINT "token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
