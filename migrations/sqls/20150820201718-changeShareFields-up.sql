ALTER TABLE `Share`
    CHANGE `byUserId` `userId` int(11) NOT NULL;
ALTER TABLE `Share`
    CHANGE `shared` `sharedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `Share`
    CHANGE `withUserId` `sharedWith` int(11) NOT NULL;
