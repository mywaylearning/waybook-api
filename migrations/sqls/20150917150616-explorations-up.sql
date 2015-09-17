CREATE TABLE IF NOT EXISTS `Exploration` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128),
  `version` varchar(128),
  `category` varchar(128),
  `slug` varchar(128),
  `image` varchar(128),
  `description` TEXT,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=0 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=compressed;


