CREATE TABLE IF NOT EXISTS `the-organizer`.`reservations` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` varchar(100) NOT NULL,
    `description` varchar(200),
    `userId` INT NOT NULL,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(userId) REFERENCES users(id)
);

ALTER TABLE `the-organizer`.`reservations` ADD COLUMN `reservationTime` TIMESTAMP DEFAULT CURRENT_TIMESTAMP;