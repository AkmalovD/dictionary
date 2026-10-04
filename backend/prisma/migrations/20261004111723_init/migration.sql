-- CreateTable
CREATE TABLE "Topic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nameRu" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameUz" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Term" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Term_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TermRelation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fromId" INTEGER NOT NULL,
    "toId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    CONSTRAINT "TermRelation_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "Term" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TermRelation_toId_fkey" FOREIGN KEY ("toId") REFERENCES "Term" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Term_topicId_idx" ON "Term"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "TermRelation_fromId_toId_key" ON "TermRelation"("fromId", "toId");
