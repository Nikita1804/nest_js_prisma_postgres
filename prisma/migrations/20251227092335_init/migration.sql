-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ADMIN', 'CUSTOMER', 'MANAGER', 'GUEST');

-- CreateEnum
CREATE TYPE "PhoneType" AS ENUM ('MOBILE', 'HOME', 'WORK', 'FAX');

-- CreateEnum
CREATE TYPE "ProductNameType" AS ENUM ('BASE', 'PRO', 'PREMIUM', 'UNLIMITED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "type" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Phone" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL DEFAULT '+7',
    "type" "PhoneType" NOT NULL DEFAULT 'MOBILE',
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Phone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" "ProductNameType" NOT NULL DEFAULT 'BASE',
    "description" TEXT,
    "token_count" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "currency" TEXT DEFAULT 'RUB',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "type" TEXT,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_type_idx" ON "User"("type");

-- CreateIndex
CREATE INDEX "Phone_number_idx" ON "Phone"("number");

-- CreateIndex
CREATE INDEX "Phone_userId_idx" ON "Phone"("userId");

-- CreateIndex
CREATE INDEX "Phone_isPrimary_idx" ON "Phone"("isPrimary");

-- CreateIndex
CREATE UNIQUE INDEX "Phone_number_userId_key" ON "Phone"("number", "userId");

-- AddForeignKey
ALTER TABLE "Phone" ADD CONSTRAINT "Phone_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
