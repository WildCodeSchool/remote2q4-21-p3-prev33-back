const connection = require("../db-config");
const router = require("express").Router();

router.get('/', (req, res) => {
    connection.query('SELECT * FROM training_category', (err, result) => {
      if (err) {
        res.status(500).send('Error retrieving training category from database');
      } else {
        res.json(result);
      }
    });
  });

router.get('/:id', (req, res) => {
  const trainingCategoryId = req.params.id;
  connection.query(
    'SELECT * FROM training category WHERE id = ?',
    [trainingCategoryId],
    (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving training category from database');
      } else {
        if (results.length) res.json(results[0]);
        else res.status(404).send('training category not found');
      }
    }
  );
});

router.post('/', (req, res) => {
  const { name, picturepath, training_id } = req.body;
  connection.query(
    'INSERT INTO training_category (name, picturepath, training_id) VALUES (?, ?, ?)',
    [name, picturepath, training_id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error saving the training category');
      } else {
        const id = result.insertId;
        const createdtrainingCategory = { id, name, picturepath, training_id};
        res.status(201).json(createdtrainingCategory);
      }
    }
  );
});

router.put('/:id', (req, res) => {
  const trainingCategoryId = req.params.id;
  const db = connection.promise();
  let existingtrainingCategory = null;
  db.query('SELECT * FROM training_category WHERE id = ?', [trainingCategoryId])
    .then(([results]) => {
      existingtrainingCategory = results[0];
      if (!existingtrainingCategory) return Promise.reject('RECORD_NOT_FOUND');
      return db.query('UPDATE training_category SET ? WHERE id = ?', [req.body, trainingCategoryId]);
    })
    .then(() => {
      res.status(200).json({ ...existingtrainingCategory, ...req.body });
    })
    .catch((err) => {
      console.error(err);
      if (err === 'RECORD_NOT_FOUND')
        res.status(404).send(`trainingCategory with id ${trainingCategoryId} not found.`);
      else res.status(500).send('Error updating a training category');
    });
});

router.delete('/:id', (req, res) => {
  connection.query(
    'DELETE FROM training_category WHERE id = ?',
    [req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error deleting an training category');
      } else {
        if (result.affectedRows) res.status(200).send('🎉 training category deleted!');
        else res.status(404).send('training category not found.');
      }
    }
  );
});

module.exports = router;