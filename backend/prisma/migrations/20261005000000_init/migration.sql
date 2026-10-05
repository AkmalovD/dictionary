-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Topic" (
    "id" SERIAL NOT NULL,
    "nameRu" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameUz" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Term" (
    "id" SERIAL NOT NULL,
    "termRu" TEXT NOT NULL DEFAULT '',
    "termEn" TEXT NOT NULL DEFAULT '',
    "termUz" TEXT NOT NULL DEFAULT '',
    "definitionRu" TEXT NOT NULL DEFAULT '',
    "definitionEn" TEXT NOT NULL DEFAULT '',
    "definitionUz" TEXT NOT NULL DEFAULT '',
    "exampleRu" TEXT NOT NULL DEFAULT '',
    "exampleEn" TEXT NOT NULL DEFAULT '',
    "exampleUz" TEXT NOT NULL DEFAULT '',
    "searchText" TEXT NOT NULL DEFAULT '',
    "topicId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Term_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TermRelation" (
    "id" SERIAL NOT NULL,
    "fromId" INTEGER NOT NULL,
    "toId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "TermRelation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Term_topicId_idx" ON "Term"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "TermRelation_fromId_toId_key" ON "TermRelation"("fromId", "toId");

-- AddForeignKey
ALTER TABLE "Term" ADD CONSTRAINT "Term_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TermRelation" ADD CONSTRAINT "TermRelation_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "Term"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TermRelation" ADD CONSTRAINT "TermRelation_toId_fkey" FOREIGN KEY ("toId") REFERENCES "Term"("id") ON DELETE CASCADE ON UPDATE CASCADE;

