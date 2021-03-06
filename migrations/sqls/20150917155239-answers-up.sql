CREATE TABLE IF NOT EXISTS `Answer` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `explorationId` int(11) unsigned NOT NULL,
  `answer` text NOT NULL,
  `order` varchar(128),
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY `explorationId` (`explorationId`)
    REFERENCES Exploration(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) AUTO_INCREMENT=0 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=compressed;
