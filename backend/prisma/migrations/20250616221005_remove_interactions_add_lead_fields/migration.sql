/*
  Warnings:

  - You are about to drop the `Interaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Interaction` DROP FOREIGN KEY `Interaction_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `Interaction` DROP FOREIGN KEY `Interaction_leadId_fkey`;

-- DropForeignKey
ALTER TABLE `Interaction` DROP FOREIGN KEY `Interaction_userId_fkey`;

-- AlterTable
ALTER TABLE `Lead` ADD COLUMN `followUpDate` DATETIME(3) NULL,
    ADD COLUMN `notes` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `Interaction`;
