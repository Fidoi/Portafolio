-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mainInfoId" INTEGER NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MainInfo" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "technologies" TEXT[],
    "urlImages" TEXT[],
    "links" TEXT[],

    CONSTRAINT "MainInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_mainInfoId_key" ON "Project"("mainInfoId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_mainInfoId_fkey" FOREIGN KEY ("mainInfoId") REFERENCES "MainInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
