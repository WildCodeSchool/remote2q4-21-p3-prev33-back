CREATE TABLE `user` (
    `id` int NOT NULL AUTO_INCREMENT,
    `isAdmin` BOOLEAN  NOT NULL ,
    `name` VARCHAR(80)  NOT NULL ,
    `lastname` VARCHAR(80)  NOT NULL ,
    `email` VARCHAR(80)  NOT NULL ,
    `phone` INT(24)  NOT NULL ,
    PRIMARY KEY (
        `id`
    )
);

CREATE TABLE `carrousel` (
    `id` int NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(80)  NOT NULL ,
    `image` VARCHAR(255)  NOT NULL ,
    PRIMARY KEY (
        `id`
    )
);

CREATE TABLE `training` (
    `id` int NOT NULL AUTO_INCREMENT ,
    `title` VARCHAR(150)  NOT NULL ,
    `picturepath` VARCHAR(255)  NULL ,
    `prerequisite` VARCHAR(80)  NULL ,
    `duration` VARCHAR(100) NULL ,
    `trainee` VARCHAR(150)  NULL ,
    `public` VARCHAR(150)  NULL ,
    `final_award` VARCHAR(100)  NULL ,
    `certificate` VARCHAR(50)  NULL ,
    `price` VARCHAR(50)  NULL ,
    `formation_goals` TEXT   NULL ,
    `program` TEXT NULL ,
    `instructor` VARCHAR(100)  NULL ,
    `teaching_method` VARCHAR(200) NULL ,
    `assesment` VARCHAR(100) NULL ,
    `address_company` VARCHAR(255) NULL ,
    `training_category_id` INT NULL ,
    PRIMARY KEY (
        `id`
    )
);

CREATE TABLE `training_category` (
    `id` int NOT NULL AUTO_INCREMENT ,
    `name` VARCHAR(80)  NOT NULL ,
    `image` VARCHAR(255)  NOT NULL ,
    PRIMARY KEY (
        `id`
    )
);

CREATE TABLE `resource` (
    `id` int NOT NULL AUTO_INCREMENT ,
    `name` VARCHAR(80)  NOT NULL ,
    `training_id` INT  NOT NULL ,
    PRIMARY KEY (
        `id`
    )
);

ALTER TABLE `training` ADD CONSTRAINT `fk_training_category_id` FOREIGN KEY(`training_category_id`)
REFERENCES `training_category` (`id`);

ALTER TABLE `resource` ADD CONSTRAINT `fk_resource_training_id` FOREIGN KEY(`training_id`)
REFERENCES `training` (`id`);

INSERT INTO `training_category` (name, image)  
VALUE
("Incendie",
"https://netatmostatic.blob.core.windows.net/static/images/guides/security/fire/solutions/type-of-fire-extinguisher-780w.jpg"),
("Sûreté",
"https://www.soec-conseil.fr/wp-content/uploads/2017/05/plan-de-s%C3%BBret%C3%A9-NB1-400x300.jpg"),
("Risque professionnels",
"https://www.agro-media.fr/wp-content/uploads/2017/01/SECURIT%C3%89.png"),
("Formation Spécifique",
"https://www.instic.fr/uploads/formations/mediums/formation-securite-spectacle-1024x435.png"),
("Prévention Incendie",
"https://netatmostatic.blob.core.windows.net/static/images/guides/security/fire/solutions/type-of-fire-extinguisher-780w.jpg"),
("Assistance Sûrté",
"https://www.soec-conseil.fr/wp-content/uploads/2017/05/plan-de-s%C3%BBret%C3%A9-NB1-400x300.jpg"),
("Assistance Risques Professionnels",
"https://www.agro-media.fr/wp-content/uploads/2017/01/SECURIT%C3%89.png"),
("Conseil",
"https://www.form-edit.com/wp-content/uploads/2019/07/examen-conseiller-s%C3%A9curit%C3%A9.jpeg");

INSERT INTO `training` (title, training_category_id) 
VALUE
('Equipier de Première Intervention (EPI)', 1),
('Manipulation des extincteurs', 1),
('Sensibilisation à la Réglementation Incendie', 1),
('Formation Responsable Unique de Sécurité', 1),
('Utilisation du Système de Securité Incendie (SSI)', 1),
('Gestion de crise', 2),
("Exercice de mise à l'abri", 2 ),
('Sauveteur et secouriste du travail', 3),
("Sensibilisation à l'hygiène et sécurité", 3),
('Formation primo intervenants', 4),
('Pack Formation à la sécurité globale (T)', 4),
('Pack Formation à la sécurité globale (ERP)', 4),
('Preparation des commissions de sécurité', 5),
("Mise en place d'exercices", 5),
("Evaluation des risques incendie", 5),
("Suivi des maintenances et vérifications techniques réglementaires", 5),
("Creation de dossier d'aide à l'intervention policière", 6),
("Diagnostic sûreté", 6),
("Aide à la création du Plan Particulier de Mise en Sécurité", 6),
("Aide à la création et mise en place du Document Unique", 7),
("Conseils Domaine Risque Professionnels", 8),
("Conseils Domaine Incendie", 8),
("Conseils Domaine Sûreté", 8);