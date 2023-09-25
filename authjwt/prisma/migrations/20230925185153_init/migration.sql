-- CreateTable
CREATE TABLE "users" (
    "address" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "hash" TEXT NOT NULL,
    "hashedRt" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "users_address_key" ON "users"("address");
