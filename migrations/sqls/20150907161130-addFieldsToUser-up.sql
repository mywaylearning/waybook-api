ALTER TABLE `WaybookUser`
ADD COLUMN `gender` char(1),
ADD COLUMN `postalCode` varchar(255),
ADD COLUMN `birthDate` TIMESTAMP,
ADD COLUMN `parentFirstName` varchar(255),
ADD COLUMN `parentEmail` varchar(255),
ADD COLUMN `parentPhone` varchar(255),
ADD COLUMN `parentLastName` varchar(255);
