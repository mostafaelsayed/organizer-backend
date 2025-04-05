CREATE TABLE IF NOT EXISTS `the-organizer`.`users` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `email` varchar(100) UNIQUE, `firstName` varchar(100),
    `phoneNumber` varchar(20),
    `passwordHash` varchar(1000),
    `lastName` varchar(50)
);

ALTER TABLE `the-organizer`.`users`
ADD CONSTRAINT UNIQUE (`email`);