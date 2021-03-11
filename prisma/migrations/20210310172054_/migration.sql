/*
  Warnings:

  - You are about to drop the column `image_id` on the `cars` table. All the data in the column will be lost.
  - You are about to drop the `images` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `image_path` to the `cars` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `cars` DROP FOREIGN KEY `cars_ibfk_1`;

-- AlterTable
ALTER TABLE `cars` DROP COLUMN `image_id`,
    ADD COLUMN     `image_path` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `images`;
