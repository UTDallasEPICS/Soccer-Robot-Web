-- CreateTable
CREATE TABLE "MatchSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numPlayers" INTEGER NOT NULL,
    "matchLength" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "MatchSettings_id_key" ON "MatchSettings"("id");
