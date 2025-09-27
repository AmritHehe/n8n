/*
  Warnings:

  - A unique constraint covering the columns `[workflowId]` on the table `Responses` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Responses_workflowId_key" ON "public"."Responses"("workflowId");
