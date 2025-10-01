/*
  Warnings:

  - The primary key for the `workflow` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."Responses" DROP CONSTRAINT "Responses_workflowId_fkey";

-- AlterTable
ALTER TABLE "public"."Responses" ALTER COLUMN "workflowId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."workflow" DROP CONSTRAINT "workflow_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "workflow_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "workflow_id_seq";

-- AddForeignKey
ALTER TABLE "public"."Responses" ADD CONSTRAINT "Responses_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "public"."workflow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
