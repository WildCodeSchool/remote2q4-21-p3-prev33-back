CREATE TABLE `user` (
    `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255)  NOT NULL ,
    `password` VARCHAR(255)  NOT NULL
);

INSERT INTO user
VALUES (
    1,
    'wcs.groupeprev33@mail.com',
    'prev33'
   );
   
CREATE TABLE `carrousel` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(80)  NOT NULL ,
    `image` VARCHAR(255)  NOT NULL ,
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

CREATE TABLE `training` (
    `id` int NOT NULL AUTO_INCREMENT ,
    `reference` VARCHAR(20)  NULL ,
    `title` VARCHAR(150)  NULL ,
    `link` VARCHAR(255)  NULL ,
    `training_category_id` INT NULL ,
    PRIMARY KEY (
        `id`
    )
);




ALTER TABLE `training` ADD CONSTRAINT `fk_training_category_id` FOREIGN KEY(`training_category_id`)
REFERENCES `training_category` (`id`);


INSERT INTO `training_category` (name, image)  
VALUE
("Incendie",
"https://netatmostatic.blob.core.windows.net/static/images/guides/security/fire/solutions/type-of-fire-extinguisher-780w.jpg"),
("Sûreté",
"https://cj-securite.fr/wp-content/uploads/2018/12/rad-sicherheit-responsive-header-personenschutz.jpg"),
("Risque professionnels",
"https://www.formation-alternance-vendee.com/wp-content/uploads/2021/01/header-sst.jpg"),
("Formation Spécifique",
"https://images.unsplash.com/photo-1462826303086-329426d1aef5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"),
("Prévention Incendie",
"https://images.unsplash.com/photo-1621135366028-8f5de4e817a1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"),
("Assistance Sûrté",
"https://images.unsplash.com/photo-1570044389283-6713c3b1c48b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"),
("Assistance Risques Pro",
"https://images.unsplash.com/photo-1624638760852-8ede1666ab07?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"),
("Conseil",
"https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80");

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
