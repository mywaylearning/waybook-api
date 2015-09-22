CREATE TABLE IF NOT EXISTS `Record` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `explorationId` int(11) unsigned NOT NULL,
  `userId` int(11) unsigned NOT NULL,
  `question` varchar(255) NOT NULL,
  `answer` varchar(255) NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=0 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=compressed;
