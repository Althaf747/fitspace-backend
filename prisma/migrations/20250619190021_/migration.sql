-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_customer_id_fkey`;

-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_field_id_fkey`;

-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_schedule_id_fkey`;

-- DropForeignKey
ALTER TABLE `field` DROP FOREIGN KEY `Field_venue_id_fkey`;

-- DropForeignKey
ALTER TABLE `fieldschedule` DROP FOREIGN KEY `FieldSchedule_field_id_fkey`;

-- DropForeignKey
ALTER TABLE `fieldschedule` DROP FOREIGN KEY `FieldSchedule_schedule_id_fkey`;

-- DropForeignKey
ALTER TABLE `gallery` DROP FOREIGN KEY `Gallery_field_id_fkey`;

-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `Review_field_id_fkey`;

-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `Review_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `venue` DROP FOREIGN KEY `Venue_owner_id_fkey`;

-- DropIndex
DROP INDEX `Booking_customer_id_fkey` ON `booking`;

-- DropIndex
DROP INDEX `Booking_field_id_fkey` ON `booking`;

-- DropIndex
DROP INDEX `Booking_schedule_id_fkey` ON `booking`;

-- DropIndex
DROP INDEX `Field_venue_id_fkey` ON `field`;

-- DropIndex
DROP INDEX `FieldSchedule_field_id_fkey` ON `fieldschedule`;

-- DropIndex
DROP INDEX `FieldSchedule_schedule_id_fkey` ON `fieldschedule`;

-- DropIndex
DROP INDEX `Gallery_field_id_fkey` ON `gallery`;

-- DropIndex
DROP INDEX `Review_field_id_fkey` ON `review`;

-- DropIndex
DROP INDEX `Review_user_id_fkey` ON `review`;

-- DropIndex
DROP INDEX `Venue_owner_id_fkey` ON `venue`;

-- AddForeignKey
ALTER TABLE `Venue` ADD CONSTRAINT `Venue_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Field` ADD CONSTRAINT `Field_venue_id_fkey` FOREIGN KEY (`venue_id`) REFERENCES `Venue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Gallery` ADD CONSTRAINT `Gallery_field_id_fkey` FOREIGN KEY (`field_id`) REFERENCES `Field`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_field_id_fkey` FOREIGN KEY (`field_id`) REFERENCES `Field`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_schedule_id_fkey` FOREIGN KEY (`schedule_id`) REFERENCES `Schedule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_field_id_fkey` FOREIGN KEY (`field_id`) REFERENCES `Field`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FieldSchedule` ADD CONSTRAINT `FieldSchedule_field_id_fkey` FOREIGN KEY (`field_id`) REFERENCES `Field`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FieldSchedule` ADD CONSTRAINT `FieldSchedule_schedule_id_fkey` FOREIGN KEY (`schedule_id`) REFERENCES `Schedule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
