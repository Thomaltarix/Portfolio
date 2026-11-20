-- CreateTable
CREATE TABLE "Resume" (
    "locale" TEXT NOT NULL,
    "content" BYTEA NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("locale")
);
