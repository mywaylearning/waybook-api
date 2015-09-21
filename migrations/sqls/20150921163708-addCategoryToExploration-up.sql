ALTER TABLE `Exploration` ADD COLUMN `categoryId` int(11) unsigned NOT NULL;
ALTER TABLE `Exploration` ADD FOREIGN KEY `categoryId` (`categoryId`) REFERENCES Category(`id`);
