/*
  Warnings:

  - You are about to drop the column `avatarUrl` on the `user` table. All the data in the column will be lost.
  - Added the required column `avatar` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `comment` ADD COLUMN `replyingTo` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `avatarUrl`,
    ADD COLUMN `avatar` VARCHAR(191) NOT NULL;
