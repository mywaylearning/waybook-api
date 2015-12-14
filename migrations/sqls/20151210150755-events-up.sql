CREATE TABLE IF NOT EXISTS `Events` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `modelName` varchar(50) NOT NULL,
  `modelId` int(11),
  `action` varchar(50) NOT NULL,
  `object` TEXT,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=compressed;
