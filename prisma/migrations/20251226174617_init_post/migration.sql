-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "type" TEXT,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);
