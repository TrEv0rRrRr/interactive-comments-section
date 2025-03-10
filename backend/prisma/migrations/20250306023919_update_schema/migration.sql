/*
  Warnings:

  - You are about to drop the column `avatarUrl` on the `User` table. All the data in the column will be lost.
  - Added the required column `avatar` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Comment` ADD COLUMN `replyingTo` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `avatarUrl`,
    ADD COLUMN `avatar` VARCHAR(191) NOT NULL;
