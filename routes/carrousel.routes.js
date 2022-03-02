const connection = require("../db-config");
const router = require("express").Router();

router.get('/', (req, res) => {
    connection.query('SELECT * FROM carrousel', (err, result) => {
      if (err) {
        res.status(500).send('Error retrieving carrousel from database');
      } else {
        res.json(result);
      }
    });
  });

router.get('/:id', (req, res) => {
  const carrouselId = req.params.id;
  connection.query(
    'SELECT * FROM carrousel WHERE id = ?',
    [carrouselId],
    (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving carrousel from database');
      } else {
        if (results.length) res.json(results[0]);
        else res.status(404).send('Carrousel not found');
      }
    }
  );
});

router.post('/', (req, res) => {
  const { title, image } = req.body;
  connection.query(
    'INSERT INTO carrousel (title, image) VALUES (?, ?)',
    [title, image],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error saving the carrousel');
      } else {
        const id = result.insertId;
        const createdCarrousel = { id, title, image };
        res.status(201).json(createdCarrousel);
      }
    }
  );
});

router.put('/:id', (req, res) => {
  const carrouselId = req.params.id;
  const db = connection.promise();
  let existingCarrousel = null;
  db.query('SELECT * FROM carrousel WHERE id = ?', [carrouselId])
    .then(([results]) => {
      existingCarrousel = results[0];
      if (!existingCarrousel) return Promise.reject('RECORD_NOT_FOUND');
      return db.query('UPDATE carrousel SET ? WHERE id = ?', [req.body, carrouselId]);
    })
    .then(() => {
      res.status(200).json({ ...existingCarrousel, ...req.body });
    })
    .catch((err) => {
      console.error(err);
      if (err === 'RECORD_NOT_FOUND')
        res.status(404).send(`Carrousel with id ${carrouselId} not found.`);
      else res.status(500).send('Error updating a carrousel');
    });
});

router.delete('/:id', (req, res) => {
  connection.query(
    'DELETE FROM carrousel WHERE id = ?',
    [req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error deleting an carrousel');
      } else {
        if (result.affectedRows) res.status(200).send('🎉 Carrousel deleted!');
        else res.status(404).send('Carrousel not found.');
      }
    }
  );
});

module.exports = router;