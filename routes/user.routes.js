const connection = require("../db-config");
const router = require("express").Router();
const Joi = require("joi");
const { generateJwt } = require("../utils/auth");
const checkJwt = require("../middlewares/checkJwt");

const { findUserByEmail, insertUser } = require("../models/user");

router.get("/", checkJwt, (req, res) => {
  connection.query("SELECT * FROM user", (err, result) => {
    if (err) {
      res.status(500).send("Error retrieving user from database");
    } else {
      res.json(result);
    }
  });
});

router.get("/:id", (req, res) => {
  const userId = req.params.id;
  connection.query(
    "SELECT * FROM user WHERE id = ?",
    [userId],
    (err, results) => {
      if (err) {
        res.status(500).send("Error retrieving user from database");
      } else {
        if (results.length) res.json(results[0]);
        else res.status(404).send("User not found");
      }
    }
  );
});

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post("/", async (req, res) => {
  // recup donnees requete
  const { value, error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json(error);
  }

  // verifie si user existe
  // await permet d'etre sur d'avoir un retour de verif user
  const [[existingUser]] = await findUserByEmail(value.email);
  if (existingUser) {
    return res.status(409).json({
      message: "l'utilisateur existe deja",
    });
  }

  // etape de l'encryptage
  // const hashedPassword = await argon2.hash(value.password);
  await insertUser(value.email, value.password);

  const jwtKey = generateJwt(value.email);
  return res.json({
    credentials: jwtKey,
  });

  // return res.json({
  //     message: "l'utilisateur a bien ete cree"
  // })
});

router.post("/login", async (req, res) => {
  // on reprend ici les verif de donnees utilisateur dans le formulaire
  const { value, error } = userSchema.validate(req.body);

  if (error) {
    return res.status(400).json(error);
  }

  const [[existingUser]] = await findUserByEmail(value.email);

  if (!existingUser) {
    return res.status(403).json({
      message: "User non trouvé ou le mot de passe ne correspond au compte",
    });
  }

  // const verified = await argon2.verify(existingUser.password, value.password);

  // if (!verified) {
  //   return res.status(403).json({
  //     message: "User non trouvé ou le mot de passe ne correspond au compte",
  //   });
  // }

  const jwtKey = generateJwt(value.email);
  return res.json({
    credentials: jwtKey,
  });
});

router.delete("/:id", (req, res) => {
  connection.query(
    "DELETE FROM user WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error deleting an user");
      } else {
        if (result.affectedRows) res.status(200).send("🎉 User deleted!");
        else res.status(404).send("User not found.");
      }
    }
  );
});

module.exports = router;
