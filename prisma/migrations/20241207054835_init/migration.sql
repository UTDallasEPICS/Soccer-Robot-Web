-- CreateTable
CREATE TABLE "Player" (
    "user_id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "games" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "ratio" REAL,
    "role" TEXT NOT NULL DEFAULT 'player'
);

-- CreateTable
CREATE TABLE "Match" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "datetime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PlayersInMatches" (
    "playerID" TEXT NOT NULL,
    "playerScore" INTEGER NOT NULL,
    "matchID" INTEGER NOT NULL,

    PRIMARY KEY ("playerID", "matchID"),
    CONSTRAINT "PlayersInMatches_playerID_fkey" FOREIGN KEY ("playerID") REFERENCES "Player" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlayersInMatches_matchID_fkey" FOREIGN KEY ("matchID") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MatchSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "numPlayers" INTEGER NOT NULL,
    "matchLength" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_username_key" ON "Player"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Player_email_key" ON "Player"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MatchSettings_id_key" ON "MatchSettings"("id");
