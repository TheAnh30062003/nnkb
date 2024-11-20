
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('SEP', 'NHANVIEN', 'ADMIN');
ALTER TABLE "user" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "deleted_by",
ADD COLUMN     "expired_at" TIMESTAMP(3);
