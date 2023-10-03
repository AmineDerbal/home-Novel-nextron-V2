-- CreateTable
CREATE TABLE "novels" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serieName" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorLink" TEXT NOT NULL,
    "lastUpdate" TEXT NOT NULL,
    "serieImageSrc" TEXT NOT NULL,
    "synopsis" TEXT NOT NULL,
    "createDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateDate" DATETIME NOT NULL
);
