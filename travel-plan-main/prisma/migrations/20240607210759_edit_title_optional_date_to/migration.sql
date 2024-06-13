/*
  Warnings:

  - You are about to drop the column `tile` on the `Destination` table. All the data in the column will be lost.
  - Added the required column `title` to the `Destination` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Destination" DROP COLUMN "tile",
ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "dateTo" DROP NOT NULL;
