CREATE TABLE IF NOT EXISTS `Task` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(128) NOT NULL,
  `tags` TEXT,
  `section` varchar(128) NOT NULL,
  `path` varchar(128),
  `skip` BOOLEAN,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=compressed;
