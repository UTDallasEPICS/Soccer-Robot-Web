-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MatchSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "numPlayers" INTEGER NOT NULL,
    "matchLength" INTEGER NOT NULL
);
INSERT INTO "new_MatchSettings" ("id", "matchLength", "numPlayers") SELECT "id", "matchLength", "numPlayers" FROM "MatchSettings";
DROP TABLE "MatchSettings";
ALTER TABLE "new_MatchSettings" RENAME TO "MatchSettings";
CREATE UNIQUE INDEX "MatchSettings_id_key" ON "MatchSettings"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
