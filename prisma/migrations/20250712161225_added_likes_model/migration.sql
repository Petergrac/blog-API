-- CreateTable
CREATE TABLE "Likes" (
    "id" TEXT NOT NULL,
    "postLikes" TEXT,
    "commentLikes" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Likes_id_key" ON "Likes"("id");
