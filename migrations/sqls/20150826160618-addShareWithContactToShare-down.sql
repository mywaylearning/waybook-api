ALTER TABLE `Share` DROP `withContact`;
ALTER TABLE `Share` MODIFY `sharedWith` int(11) NOT NULL;
