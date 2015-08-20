ALTER TABLE `Share` 
    CHANGE `userId` `byUserId` int(11) NOT NULL;
ALTER TABLE `Share` 
    CHANGE `sharedAt` `shared` TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `Share` 
    CHANGE `contactId` `withUserId` int(11) NOT NULL;
