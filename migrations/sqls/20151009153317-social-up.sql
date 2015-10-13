CREATE TABLE IF NOT EXISTS `Social` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `provider` varchar(128) NOT NULL,
  `providerId` varchar(128),
  `email` varchar(128) NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=compressed;
