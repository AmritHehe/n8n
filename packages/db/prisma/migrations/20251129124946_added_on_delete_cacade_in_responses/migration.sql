-- DropForeignKey
ALTER TABLE "public"."Responses" DROP CONSTRAINT "Responses_workflowId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Responses" ADD CONSTRAINT "Responses_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "public"."workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
