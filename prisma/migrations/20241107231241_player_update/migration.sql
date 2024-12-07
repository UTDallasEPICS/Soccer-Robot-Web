-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Player" (
    "user_id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "games" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "ratio" REAL
);
INSERT INTO "new_Player" ("email", "games", "goals", "user_id", "username", "wins") SELECT "email", "games", "goals", "user_id", "username", "wins" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
CREATE UNIQUE INDEX "Player_username_key" ON "Player"("username");
CREATE UNIQUE INDEX "Player_email_key" ON "Player"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
