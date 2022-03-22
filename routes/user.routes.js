const connection = require("../db-config");
const router = require("express").Router();
const Joi = require('joi');
const argon2 = require('argon2');
const { generateJwt } = require('../utils/auth');
const checkJwt = require('../middlewares/checkJwt');

const { findUserByEmail, insertUser } = require('../models/user');

router.get('/', checkJwt, (req, res) => {
    connection.query('SELECT * FROM user', (err, result) => {
      if (err) {
        res.status(500).send('Error retrieving user from database');
      } else {
        res.json(result);
      }
    });
  });

router.get('/:id', (req, res) => {
  const userId = req.params.id;
  connection.query(
    'SELECT * FROM user WHERE id = ?',
    [userId],
    (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving user from database');
      } else {
        if (results.length) res.json(results[0]);
        else res.status(404).send('User not found');
      }
    }
  );
});

const userSchema = Joi.object({
  email : Joi.string().email().required(),
  password: Joi.string().required()
})

router.post('/', async (req, res) => {
  // recupération données requête
  const { value, error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json(error);
  }
  //vérifie si user existe
  //await permet d'être sûr d'avoir un retour de vérif user.
  const [[existingUser]] = await findUserByEmail(value.email);
  if (existingUser) {
    return res.status(409).json({
      message : "l'utilisateur existe déjà",
    })
  }
  // étape de l'ecryptage
  const hashedPassword = await argon2.hash(value.password);
  await insertUser(value.email, hashedPassword);

  const jwtKey = generateJwt(value.email);
  return res.json({
    credentials: jwtKey
  })
})

router.post('/login', async (req, res) => {
  // on reprend les vérifs de données utilisateur
  const { value, error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json(error);
  }

  const [[existingUser]] = await findUserByEmail(value.email);

  if (!existingUser) {
    return res.status(403).json({
      message: 'utilisateur non trouvé ou mot de passe non correspondant au compte'
    })
  }

  const verified = await argon2.verify(existingUser.password, value.password)

  if (!verified) {
    return res.status(403).json({
      message: 'utilisateur non trouvé ou mot de passe non correspondant au compte'
    })
  }

  const jwtKey = generateJwt(value.email);
  return res.json({
    credentials: jwtKey
  })
})



// router.post('/', (req, res) => {
//   const { isAdmin, name, lastname, email, phone } = req.body;
//   connection.query(
//     'INSERT INTO user (isAdmin, name, lastname, email, phone) VALUES (?, ?, ?, ?, ?)',
//     [isAdmin, name, lastname, email, phone],
//     (err, result) => {
//       if (err) {
//         console.error(err);
//         res.status(500).send('Error saving the user');
//       } else {
//         const id = result.insertId;
//         const createdUser = { id, isAdmin, name, lastname, email, phone };
//         res.status(201).json(createdUser);
//       }
//     }
//   );
// });

router.put('/:id', (req, res) => {
  const userId = req.params.id;
  const db = connection.promise();
  let existingUser = null;
  db.query('SELECT * FROM user WHERE id = ?', [userId])
    .then(([results]) => {
      existingUser = results[0];
      if (!existingUser) return Promise.reject('RECORD_NOT_FOUND');
      return db.query('UPDATE user SET ? WHERE id = ?', [req.body, userId]);
    })
    .then(() => {
      res.status(200).json({ ...existingUser, ...req.body });
    })
    .catch((err) => {
      console.error(err);
      if (err === 'RECORD_NOT_FOUND')
        res.status(404).send(`User with id ${userId} not found.`);
      else res.status(500).send('Error updating a user');
    });
});

router.delete('/:id', (req, res) => {
  connection.query(
    'DELETE FROM user WHERE id = ?',
    [req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error deleting an user');
      } else {
        if (result.affectedRows) res.status(200).send('🎉 User deleted!');
        else res.status(404).send('User not found.');
      }
    }
  );
});

module.exports = router;