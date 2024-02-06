-- CreateTable
CREATE TABLE "pollOption" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "pollId" TEXT NOT NULL,

    CONSTRAINT "pollOption_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pollOption" ADD CONSTRAINT "pollOption_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
