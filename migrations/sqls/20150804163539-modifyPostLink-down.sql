ALTER TABLE `Post`
ADD COLUMN `linkTitle` varchar(255),
ADD COLUMN `linkDescription` text;

ALTER TABLE `Post` MODIFY `link` varchar(255);
