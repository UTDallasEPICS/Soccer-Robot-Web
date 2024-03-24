-- CreateTable
CREATE TABLE "Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT
);

-- CreateTable
CREATE TABLE "Match" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "datetime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PlayersInMatches" (
    "playerID" INTEGER NOT NULL,
    "playerScore" INTEGER NOT NULL,
    "matchID" INTEGER NOT NULL,

    PRIMARY KEY ("playerID", "matchID"),
    CONSTRAINT "PlayersInMatches_playerID_fkey" FOREIGN KEY ("playerID") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlayersInMatches_matchID_fkey" FOREIGN KEY ("matchID") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_username_key" ON "Player"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Player_email_key" ON "Player"("email");
