/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS `WaybookUser` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(128) COMMENT 'unused, but queried by loopack-component-oauth2',
  `email` varchar(128) NOT NULL,
  `password` varchar(128) NOT NULL,
  `status` char(1) NOT NULL DEFAULT 'A',
  `created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `lastUpdated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `email_password_status_index` (`email`, `password`, `status`)
) AUTO_INCREMENT=95089 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=compressed;

CREATE TABLE IF NOT EXISTS `OAuth2ClientApplication` (
  `id` varchar(128) NOT NULL,
  `realm` varchar(128),
  `name` varchar(128),
  `description` varchar(255),
  `icon` varchar(255),
  `owner` int(11) unsigned NOT NULL,
  `collaborators` varchar(255),
  `email` varchar(128),
  `emailVerified` tinyint(1),
  `url` varchar(255),
  `callbackUrls` text,
  `permissions` text,
  `clientKey` varchar(128),
  `javaScriptKey` varchar(128),
  `restApiKey` varchar(128),
  `windowsKey` varchar(128),
  `masterKey` varchar(128),
  `pushSettings` text,
  `authenticationEnabled` BOOLEAN,
  `anonymousAllowed` BOOLEAN,
  `authenticationSchemes` text,
  `status` enum('sandbox', 'production', 'disabled'),
  `created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `modified` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `clientType` enum('public', 'confidential'),
  `redirectURIs` TEXT,
  `tokenEndpointAuthMethod` enum('none', 'client_secret_post', 'client_secret_basic'),
  `grantTypes` enum('authorization_code', 'implicit', 'client_credentials', 'password', 'urn:ietf:params:oauth:grant-type:jwt-bearer', 'urn:ietf:params:oauth:grant-type:saml2-bearer'),
  `responseTypes` enum('code', 'token'),
  `tokenType` enum('bearer', 'jwt', 'mac'),
  `clientSecret` varchar(255),
  `clientName` varchar(255),
  `clientURI` varchar(255),
  `logoURI` varchar(255),
  `scope` varchar(255),
  `contacts` TEXT,
  `tosURI` varchar(255),
  `policyURI` varchar(255),
  `jwksURI` varchar(255),
  `jwks` varchar(255),
  `softwareId` varchar(255),
  `softwareVersion` varchar(255),
  PRIMARY KEY (`id`),
  FOREIGN KEY `userId` (`owner`)
    REFERENCES WaybookUser(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) AUTO_INCREMENT=15090 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=compressed;

CREATE TABLE IF NOT EXISTS `OAuthAccessToken` (
  `id` varchar(255) NOT NULL,
  `appId` varchar(128) NOT NULL,
  `userId` int(11) unsigned NOT NULL,
  `issuedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `expiresIn` int(10) unsigned,
  `expiredAt` TIMESTAMP,
  `scopes` TEXT,
  `parameters` TEXT,
  `authorizationCode` varchar(255),
  `refreshToken` varchar(255) NOT NULL,
  `tokenType` enum('Bearer', 'MAC'),
  `hash` TEXT,
  PRIMARY KEY (`id`),
  FOREIGN KEY `userId` (`userId`)
    REFERENCES WaybookUser(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  FOREIGN KEY `appId` (`appId`)
    REFERENCES OAuth2ClientApplication(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  KEY `refreshToken_index` (`refreshToken`)
) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=compressed;
/*
CREATE TABLE IF NOT EXISTS `oauth2_authorization_code` (
  `id` varchar(255) NOT NULL,
  `appId` varchar(128) NOT NULL,
  `userId` int(11) unsigned NOT NULL,
  `issuedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `expiresIn` int(10) unsigned,
  `expiredAt` TIMESTAMP,
  `scopes` TEXT,
  `parameters` TEXT,
  `used` BOOLEAN,
  `redirectURI` varchar(255),
  `hash` TEXT,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=compressed;

CREATE TABLE IF NOT EXISTS `oauth2_permission` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `appId` varchar(128) NOT NULL,
  `userId` int(11) unsigned NOT NULL,
  `expiresIn` int(10) unsigned,
  `expiredAt` TIMESTAMP,
  `scopes` TEXT,
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=compressed;

CREATE TABLE IF NOT EXISTS `oauth2_scope_mapping` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `scope` varchar(128) NOT NULL,
  `route` varchar(128) NOT NULL,
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=compressed;

CREATE TABLE IF NOT EXISTS `oauth2_scope` (
  `scope` varchar(128) NOT NULL,
  `description` text,
  `iconURL` varchar(255),
  `ttl` int(10) unsigned,
  PRIMARY KEY (`scope`)
) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=compressed;
*/
CREATE TABLE IF NOT EXISTS `ACL` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `model` varchar(128),
  `property` varchar(128),
  `accessType` varchar(128),
  `permission` varchar(128),
  `principalType` varchar(128),
  `principalId` varchar(128),
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=compressed;

CREATE TABLE IF NOT EXISTS `RoleMapping` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `principalType` varchar(128),
  `principalId` varchar(128),
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=compressed;

CREATE TABLE IF NOT EXISTS `Role` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `description` text,
  `created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `modified` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=compressed;

CREATE TABLE IF NOT EXISTS `Post` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(11) unsigned NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text,
  `tags` text,
  `systemTags` text,
  `image` varchar(255),
  `files` text,
  `type` varchar(50),
  `sourceType` varchar(50),
  `sourceId` int(11) unsigned NOT NULL,
  `gImportance` varchar(128),
  `gStatus` varchar(128),
  `gStartDate` TIMESTAMP,
  `gEndDate` TIMESTAMP,
  `gAchievedDate` TIMESTAMP,
  `gAbandonedDate` TIMESTAMP,
  `gRecurringEnabled` BOOLEAN,
  `gRecurringFrequency` varchar(128),
  `gRecurringRepeatsEvery` varchar(128),
  `gRecurringRepeatsOn` varchar(128),
  `gRecurringStartsOn` TIMESTAMP,
  `gRecurringEndsOn` TIMESTAMP,
  `gRecurringRecurrence` text,
  `gRecurringText` varchar(255),
  `gRecurringTracker` text,
  `sortOrder` INT(10) unsigned,
  `editable` BOOLEAN DEFAULT '1',
  `created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) unsigned NOT NULL,
  `lastUpdated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId_type_lastUpdated_index` (`userId`, `type`, `lastUpdated`),
  FOREIGN KEY `userId` (`userId`)
    REFERENCES WaybookUser(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) AUTO_INCREMENT=29905 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=compressed;

CREATE TABLE IF NOT EXISTS `Comment` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(11) unsigned NOT NULL,
  `postId` int(11) unsigned NOT NULL,
  `comment` text,
  `tags` text,
  `created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `lastUpdated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY `userId` (`userId`)
    REFERENCES WaybookUser(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  FOREIGN KEY `postId` (`postId`)
    REFERENCES Post(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) AUTO_INCREMENT=38256 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=compressed;

CREATE TABLE IF NOT EXISTS `Discovery` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(11) unsigned NOT NULL,
  `explorationId` varchar(50) NOT NULL,
  `explorationVersion` varchar(50),
  `currentQuestionId` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId_explorationId_index` (`userId`, `explorationId`),
  FOREIGN KEY `userId` (`userId`)
    REFERENCES WaybookUser(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) AUTO_INCREMENT=84789 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=compressed;

CREATE TABLE IF NOT EXISTS `DiscoveryResponse` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `discoveryId` int(11) unsigned NOT NULL,
  `questionId` int(10) unsigned,
  `answerValue` int(10) unsigned,
  PRIMARY KEY (`id`),
  KEY `discoveryId_index` (`discoveryId`),
  FOREIGN KEY `discoveryId` (`discoveryId`)
    REFERENCES Discovery(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=compressed;

CREATE TABLE IF NOT EXISTS `Supporter` (
  `id` int(11) unsigned NOT NULL COMMENT 'this id is the userId of the Supporter',
  `userId` int(11) unsigned NOT NULL COMMENT 'this id is the userId of the Supported',
  `postId` int(11) unsigned NOT NULL COMMENT 'support relationship relates to a specific goal/habit',
  `invitationId` int(11) unsigned NOT NULL COMMENT 'relationship created as a result of an accepted invitation',
  `added` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`, `userId`, `postId`),
  KEY `id_index` (`id`),
  KEY `userId` (`userId`),
  KEY `postId` (`postId`)
) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=compressed;

-- CREATE TABLE IF NOT EXISTS `invitation` (
--   `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
--   PRIMARY KEY (`id`)
-- ) AUTO_INCREMENT=24597 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=compressed;

CREATE TABLE IF NOT EXISTS `Share` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `postId` int(11) unsigned NOT NULL,
  `byUserId` int(11) unsigned NOT NULL,
  `withUserId` int(11) unsigned NOT NULL,
  `shared` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `postId_index` (`postId`)
) AUTO_INCREMENT=45698 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=compressed;

CREATE TABLE IF NOT EXISTS `WaybookUserDetail` (
  `userId` int(11) unsigned NOT NULL,
  `property` varchar(128) NOT NULL,
  `propertyName` varchar(128),
  `propertyGroup` varchar(128),
  `valueType` enum('d', 's'),
  `valueString` varchar(255),
  `valueTimestamp` TIMESTAMP,
  `visible` BOOLEAN,
  `sortOrder` INT(4),
  PRIMARY KEY (`userId`, `property`),
  KEY `userId_index` (`userId`),
  KEY `userId_sortOrder_index` (`userId`, `sortOrder`),
  FOREIGN KEY `userId` (`userId`)
    REFERENCES WaybookUser(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=compressed;
