/*
  Warnings:

  - You are about to drop the column `additional_Information` on the `Experience` table. All the data in the column will be lost.
  - The `to` column on the `Experience` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `from` on the `Education` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `to` on the `Education` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `additional_information` to the `Experience` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `from` on the `Experience` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Education" DROP COLUMN "from",
ADD COLUMN     "from" TIMESTAMP(3) NOT NULL,
DROP COLUMN "to",
ADD COLUMN     "to" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Experience" DROP COLUMN "additional_Information",
ADD COLUMN     "additional_information" TEXT NOT NULL,
DROP COLUMN "from",
ADD COLUMN     "from" TIMESTAMP(3) NOT NULL,
DROP COLUMN "to",
ADD COLUMN     "to" TIMESTAMP(3);
