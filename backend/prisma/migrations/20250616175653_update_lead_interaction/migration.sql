/*
  Warnings:

  - You are about to alter the column `type` on the `Interaction` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to alter the column `status` on the `Lead` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `Interaction` ADD COLUMN `customerId` INTEGER NULL,
    ADD COLUMN `leadId` INTEGER NULL,
    MODIFY `type` ENUM('CUSTOMER', 'LEAD', 'NOTE') NOT NULL;

-- AlterTable
ALTER TABLE `Lead` ADD COLUMN `customerId` INTEGER NULL,
    MODIFY `status` ENUM('NEW', 'CONTACTED', 'QUALIFIED', 'LOST') NOT NULL DEFAULT 'NEW';

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Interaction` ADD CONSTRAINT `Interaction_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Interaction` ADD CONSTRAINT `Interaction_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
