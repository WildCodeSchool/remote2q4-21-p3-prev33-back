const connection = require("../db-config");
const router = require("express").Router();

router.get('/', (req, res) => {
    connection.query('SELECT * FROM training', (err, result) => {
      if (err) {
        res.status(500).send('Error retrieving training from database');
      } else {
        res.json(result);
      }
    });
  });

router.get('/:id', (req, res) => {
  const trainingId = req.params.id;
  connection.query(
    'SELECT * FROM training WHERE id = ?',
    [trainingId],
    (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving training from database');
      } else {
        if (results.length) res.json(results[0]);
        else res.status(404).send('Training not found');
      }
    }
  );
});

router.post('/', (req, res) => {
  const { title, picturepath, prerequisite, duration, trainee, public, final_award, certificate, price, formation_goals, program, instructor, teaching_method, assesment, address_company } = req.body;
  connection.query(
    'INSERT INTO training (title, picturepath, prerequisite, duration, trainee, public, final_award, certificate, price, formation_goals, program, instructor, teaching_method, assesment, address_company) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [title, picturepath, prerequisite, duration, trainee, public, final_award, certificate, price, formation_goals, program, instructor, teaching_method, assesment, address_company],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error saving the training');
      } else {
        const id = result.insertId;
        const createdTraining = { id, title, picturepath, prerequisite, duration, trainee, public, final_award, certificate, price, formation_goals, program, instructor, teaching_method, assesment, address_company };
        res.status(201).json(createdTraining);
      }
    }
  );
});

router.put('/:id', (req, res) => {
  const trainingId = req.params.id;
  const db = connection.promise();
  let existingTraining = null;
  db.query('SELECT * FROM training WHERE id = ?', [trainingId])
    .then(([results]) => {
      existingTraining = results[0];
      if (!existingTraining) return Promise.reject('RECORD_NOT_FOUND');
      return db.query('UPDATE training SET ? WHERE id = ?', [req.body, trainingId]);
    })
    .then(() => {
      res.status(200).json({ ...existingTraining, ...req.body });
    })
    .catch((err) => {
      console.error(err);
      if (err === 'RECORD_NOT_FOUND')
        res.status(404).send(`Training with id ${trainingId} not found.`);
      else res.status(500).send('Error updating a training');
    });
});

router.delete('/:id', (req, res) => {
  connection.query(
    'DELETE FROM training WHERE id = ?',
    [req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error deleting an training');
      } else {
        if (result.affectedRows) res.status(200).send('🎉 Training deleted!');
        else res.status(404).send('Training not found.');
      }
    }
  );
});

module.exports = router;