ALTER TABLE `Post` DROP `linkDescription`;
ALTER TABLE `Post` DROP `linkTitle`;
ALTER TABLE `Post` MODIFY `link` text;
