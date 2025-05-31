/*
  Warnings:

  - You are about to drop the column `createdAt` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `fieldId` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `scheduleId` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `field` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `field` table. All the data in the column will be lost.
  - You are about to drop the column `venueId` on the `field` table. All the data in the column will be lost.
  - You are about to drop the column `fieldId` on the `fieldschedule` table. All the data in the column will be lost.
  - You are about to drop the column `scheduleId` on the `fieldschedule` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `gallery` table. All the data in the column will be lost.
  - You are about to drop the column `fieldId` on the `gallery` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `gallery` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `review` table. All the data in the column will be lost.
  - You are about to drop the column `fieldId` on the `review` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `review` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `review` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `timeSlot` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `otpExpiredAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `cityOrRegency` on the `venue` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `venue` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `venue` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `venue` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `venue` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `venue` table. All the data in the column will be lost.
  - Added the required column `customer_id` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schedule_id` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `venue_id` to the `Field` table without a default value. This is not possible if the table is not empty.
  - Added the required column `field_id` to the `FieldSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schedule_id` to the `FieldSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `field_id` to the `Gallery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `field_id` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time_slot` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city_or_regency` to the `Venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `Venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `Venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postal_code` to the `Venue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_fieldId_fkey`;

-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_scheduleId_fkey`;

-- DropForeignKey
ALTER TABLE `field` DROP FOREIGN KEY `Field_venueId_fkey`;

-- DropForeignKey
ALTER TABLE `fieldschedule` DROP FOREIGN KEY `FieldSchedule_fieldId_fkey`;

-- DropForeignKey
ALTER TABLE `fieldschedule` DROP FOREIGN KEY `FieldSchedule_scheduleId_fkey`;

-- DropForeignKey
ALTER TABLE `gallery` DROP FOREIGN KEY `Gallery_fieldId_fkey`;

-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `Review_fieldId_fkey`;

-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `Review_userId_fkey`;

-- DropForeignKey
ALTER TABLE `venue` DROP FOREIGN KEY `Venue_ownerId_fkey`;

-- DropIndex
DROP INDEX `Booking_customerId_fkey` ON `booking`;

-- DropIndex
DROP INDEX `Booking_fieldId_fkey` ON `booking`;

-- DropIndex
DROP INDEX `Booking_scheduleId_fkey` ON `booking`;

-- DropIndex
DROP INDEX `Field_venueId_fkey` ON `field`;

-- DropIndex
DROP INDEX `FieldSchedule_fieldId_fkey` ON `fieldschedule`;

-- DropIndex
DROP INDEX `FieldSchedule_scheduleId_fkey` ON `fieldschedule`;

-- DropIndex
DROP INDEX `Gallery_fieldId_fkey` ON `gallery`;

-- DropIndex
DROP INDEX `Review_fieldId_fkey` ON `review`;

-- DropIndex
DROP INDEX `Review_userId_fkey` ON `review`;

-- DropIndex
DROP INDEX `Venue_ownerId_fkey` ON `venue`;

-- AlterTable
ALTER TABLE `booking` DROP COLUMN `createdAt`,
    DROP COLUMN `customerId`,
    DROP COLUMN `fieldId`,
    DROP COLUMN `scheduleId`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `customer_id` INTEGER NOT NULL,
    ADD COLUMN `field_id` INTEGER NULL,
    ADD COLUMN `schedule_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `field` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `venueId`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `venue_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `fieldschedule` DROP COLUMN `fieldId`,
    DROP COLUMN `scheduleId`,
    ADD COLUMN `field_id` INTEGER NOT NULL,
    ADD COLUMN `schedule_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `gallery` DROP COLUMN `createdAt`,
    DROP COLUMN `fieldId`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `field_id` INTEGER NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `review` DROP COLUMN `createdAt`,
    DROP COLUMN `fieldId`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `userId`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `field_id` INTEGER NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `schedule` DROP COLUMN `createdAt`,
    DROP COLUMN `timeSlot`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `time_slot` VARCHAR(255) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `user` DROP COLUMN `createdAt`,
    DROP COLUMN `firstName`,
    DROP COLUMN `lastName`,
    DROP COLUMN `otpExpiredAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `first_name` VARCHAR(100) NOT NULL,
    ADD COLUMN `last_name` VARCHAR(100) NULL,
    ADD COLUMN `otp_expired_at` DATETIME(3) NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `venue` DROP COLUMN `cityOrRegency`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `ownerId`,
    DROP COLUMN `phoneNumber`,
    DROP COLUMN `postalCode`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `city_or_regency` VARCHAR(100) NOT NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `owner_id` INTEGER NOT NULL,
    ADD COLUMN `phone_number` VARCHAR(100) NOT NULL,
    ADD COLUMN `postal_code` VARCHAR(100) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `Venue` ADD CONSTRAINT `Venue_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Field` ADD CONSTRAINT `Field_venue_id_fkey` FOREIGN KEY (`venue_id`) REFERENCES `Venue`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Gallery` ADD CONSTRAINT `Gallery_field_id_fkey` FOREIGN KEY (`field_id`) REFERENCES `Field`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_field_id_fkey` FOREIGN KEY (`field_id`) REFERENCES `Field`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_schedule_id_fkey` FOREIGN KEY (`schedule_id`) REFERENCES `Schedule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_field_id_fkey` FOREIGN KEY (`field_id`) REFERENCES `Field`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FieldSchedule` ADD CONSTRAINT `FieldSchedule_field_id_fkey` FOREIGN KEY (`field_id`) REFERENCES `Field`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FieldSchedule` ADD CONSTRAINT `FieldSchedule_schedule_id_fkey` FOREIGN KEY (`schedule_id`) REFERENCES `Schedule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
