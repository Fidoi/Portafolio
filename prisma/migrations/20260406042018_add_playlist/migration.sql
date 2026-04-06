-- CreateTable
CREATE TABLE "PlayList" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayList_pkey" PRIMARY KEY ("id")
);
