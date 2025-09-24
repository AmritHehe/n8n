-- CreateTable
CREATE TABLE "public"."Responses" (
    "id" SERIAL NOT NULL,
    "data" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workflowId" INTEGER NOT NULL,

    CONSTRAINT "Responses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Responses" ADD CONSTRAINT "Responses_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "public"."workflow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Responses" ADD CONSTRAINT "Responses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
