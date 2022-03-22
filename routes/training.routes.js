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
  const { reference, title, link, training_category_id } = req.body;
  connection.query(
    'INSERT INTO training (reference, title, link, training_category_id) VALUES (?, ?, ?, ?)',
    [reference, title, link, training_category_id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error saving the training');
      } else {
        const id = result.insertId;
        const createdtraining = { id, reference, title, link, training_category_id };
        res.status(201).json(createdtraining);
      }
    }
  );
});

router.put('/:id', (req, res) => {
  const trainingId = req.params.id;
  const db = connection.promise();
  let existingtraining = null;
  db.query('SELECT * FROM training WHERE id = ?', [trainingId])
    .then(([results]) => {
      existingtraining = results[0];
      if (!existingtraining) return Promise.reject('RECORD_NOT_FOUND');
      return db.query('UPDATE training SET ? WHERE id = ?', [req.body, trainingId]);
    })
    .then(() => {
      res.status(200).json({ ...existingtraining, ...req.body });
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
        if (result.affectedRows) res.status(200).send('🎉 training deleted!');
        else res.status(404).send('Training not found.');
      }
    }
  );
});

module.exports = router;