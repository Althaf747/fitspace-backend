/*
  Warnings:

  - You are about to alter the column `type` on the `field` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `photoUrl` on the `gallery` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to drop the column `resetToken` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `resetTokenExpiredAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `tokenExpiredAt` on the `user` table. All the data in the column will be lost.
  - You are about to alter the column `firstName` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `lastName` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `password` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `name` on the `venue` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `phoneNumber` on the `venue` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `street` on the `venue` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `district` on the `venue` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `cityOrRegency` on the `venue` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `province` on the `venue` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `postalCode` on the `venue` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.

*/
-- DropIndex
DROP INDEX `User_resetToken_key` ON `user`;

-- DropIndex
DROP INDEX `User_token_key` ON `user`;

-- AlterTable
ALTER TABLE `booking` MODIFY `status` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `field` MODIFY `type` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `gallery` MODIFY `photoUrl` VARCHAR(100) NOT NULL,
    MODIFY `description` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `review` MODIFY `comment` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `schedule` MODIFY `timeSlot` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `resetToken`,
    DROP COLUMN `resetTokenExpiredAt`,
    DROP COLUMN `token`,
    DROP COLUMN `tokenExpiredAt`,
    MODIFY `firstName` VARCHAR(100) NOT NULL,
    MODIFY `lastName` VARCHAR(100) NULL,
    MODIFY `password` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `venue` MODIFY `name` VARCHAR(100) NOT NULL,
    MODIFY `phoneNumber` VARCHAR(100) NOT NULL,
    MODIFY `street` VARCHAR(100) NOT NULL,
    MODIFY `district` VARCHAR(100) NOT NULL,
    MODIFY `cityOrRegency` VARCHAR(100) NOT NULL,
    MODIFY `province` VARCHAR(100) NOT NULL,
    MODIFY `postalCode` VARCHAR(100) NOT NULL;
