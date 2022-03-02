const connection = require("../db-config");
const router = require("express").Router();

router.get('/', (req, res) => {
    connection.query('SELECT * FROM resource', (err, result) => {
      if (err) {
        res.status(500).send('Error retrieving resource from database');
      } else {
        res.json(result);
      }
    });
  });

router.get('/:id', (req, res) => {
  const resourceId = req.params.id;
  connection.query(
    'SELECT * FROM resource WHERE id = ?',
    [resourceId],
    (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving resource from database');
      } else {
        if (results.length) res.json(results[0]);
        else res.status(404).send('Resource not found');
      }
    }
  );
});

router.post('/', (req, res) => {
  const { name, training_id } = req.body;
  connection.query(
    'INSERT INTO resource (name, training_id) VALUES (?, ?)',
    [name, training_id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error saving the resource');
      } else {
        const id = result.insertId;
        const createdResource = { name, training_id };
        res.status(201).json(createdResource);
      }
    }
  );
});

router.put('/:id', (req, res) => {
  const resourceId = req.params.id;
  const db = connection.promise();
  let existingResource = null;
  db.query('SELECT * FROM resource WHERE id = ?', [resourceId])
    .then(([results]) => {
      existingResource = results[0];
      if (!existingResource) return Promise.reject('RECORD_NOT_FOUND');
      return db.query('UPDATE resource SET ? WHERE id = ?', [req.body, resourceId]);
    })
    .then(() => {
      res.status(200).json({ ...existingResource, ...req.body });
    })
    .catch((err) => {
      console.error(err);
      if (err === 'RECORD_NOT_FOUND')
        res.status(404).send(`Resource with id ${resourceId} not found.`);
      else res.status(500).send('Error updating a resource');
    });
});

router.delete('/:id', (req, res) => {
  connection.query(
    'DELETE FROM resource WHERE id = ?',
    [req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error deleting an resource');
      } else {
        if (result.affectedRows) res.status(200).send('🎉 Resource deleted!');
        else res.status(404).send('Resource not found.');
      }
    }
  );
});

module.exports = router;