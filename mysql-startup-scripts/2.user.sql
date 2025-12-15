CREATE TABLE IF NOT EXISTS `organizer`.`users` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `email` varchar(100) UNIQUE, `firstName` varchar(100),
    `phoneNumber` varchar(20),
    `passwordHash` varchar(1000),
    `lastName` varchar(50)
);

ALTER TABLE `organizer`.`users`
ADD CONSTRAINT UNIQUE (`email`);

ALTER TABLE `organizer`.`users` ADD COLUMN `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, ADD COLUMN `updatedAT` TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
