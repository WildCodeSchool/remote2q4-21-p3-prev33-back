-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/ZLSH44
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE `user` (
    `id` INT  NOT NULL AUTO_INCREMENT,
    `isAdmin` BOOLEAN  NOT NULL ,
    `name` VARCHAR(80)  NOT NULL ,
    `lastname` VARCHAR(80)  NOT NULL ,
    `email` VARCHAR(80)  NOT NULL UNIQUE ,
    `phone` INT(24)  NULL ,
    PRIMARY KEY (
        `id`
    )
);

CREATE TABLE `carrousel` (
    `id` INT  NOT NULL AUTO_INCREMENT ,
    `title` VARCHAR(80)  NOT NULL ,
    `image` VARCHAR(255)  NOT NULL ,
    PRIMARY KEY (
        `id`
    )
);

CREATE TABLE `training` (
    `id` INT  NOT NULL AUTO_INCREMENT ,
    `title` VARCHAR(150)  NOT NULL ,
    `picturepath` VARCHAR(255) NULL ,
    `prerequisite` VARCHAR(80) NULL ,
    `duration` VARCHAR(100) NULL ,
    `trainee` VARCHAR(150) NULL ,
    `public` VARCHAR(150) NULL ,
    `final_award` VARCHAR(100) NULL ,
    `certificate` VARCHAR(50) NULL ,
    `price` VARCHAR(50) NULL ,
    `formation_goals` TEXT NULL ,
    `program` TEXT  NULL ,
    `instructor` VARCHAR(100)  NULL ,
    `teaching_method` VARCHAR(200)  NULL ,
    `assesment` VARCHAR(100)  NULL ,
    `address_company` VARCHAR(255)  NULL ,
    PRIMARY KEY (
        `id`
    )
);

CREATE TABLE `training_category` (
    `id` INT  NOT NULL AUTO_INCREMENT ,
    `name` VARCHAR(80)  NOT NULL ,
    `picturepath` VARCHAR(255)  NOT NULL ,
    `training_id` INT  NOT NULL ,
    PRIMARY KEY (
        `id`
    )
);

CREATE TABLE `resource` (
    `id` INT  NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(80)  NOT NULL ,
    `training_id` INT  NOT NULL ,
    PRIMARY KEY (
        `id`
    )
);

-- ALTER TABLE `training` ADD CONSTRAINT `fk_training_id` FOREIGN KEY(`id`)
-- REFERENCES `training_category` (`training_id`);
ALTER TABLE `training_category` ADD CONSTRAINT `fk_training_category_training_id` FOREIGN KEY(`training_id`)
REFERENCES `training` (`id`);

ALTER TABLE `resource` ADD CONSTRAINT `fk_resource_training_id` FOREIGN KEY(`training_id`)
REFERENCES `training` (`id`);


