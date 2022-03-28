const connection = require("../db-config");
const router = require("express").Router();
const multer = require("multer");
const {
  findAll,
  findOne,
  insertFile,
  deleteFile,
} = require("../models/files");

const upload = multer({
  dest: "uploads/files/"
});

router.get("/", async (req, res) => {
  const [training] = await findAll();
  res.json(training);
});

router.get("/:id", async (req, res) => {
  const trainingId = await findOne(req.params.id);
  res.json(trainingId);
});

router.post("/", upload.single("link"), async (req, res) => {
  const [{
    insertId: id
  }] = await insertFile(req.body, req.file.path);
  return res.json({
    ...req.body,
    id,
    link: req.file.filename,
  });
});

router.delete("/:id", async (req, res) => {
  const trainingId = await deleteFile(req.params.id);
  res.json(trainingId);
});

router.get('/training/:title', (req, res) => {
  const trainingTitle = req.params.title;
  connection.query(
    'SELECT * FROM training WHERE title= ?',
    [trainingTitle],
    (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving training title from database');
      } else {
        if (results.length) res.json(results[0]);
        else res.status(404).send('Training title not found');
      }
    }
  );
});

router.post('/', (req, res) => {
  const {
    reference,
    title,
    link,
    training_category_id
  } = req.body;
  connection.query(
    'INSERT INTO training (reference, title, link, training_category_id) VALUES (?, ?, ?, ?)',
    [reference, title, link, training_category_id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error saving the training');
      } else {
        const id = result.insertId;
        const createdtraining = {
          id,
          reference,
          title,
          link,
          training_category_id
        };
        res.status(201).json(createdtraining);
      }
    }
  );
});

// router.put('/:id', (req, res) => {
//   const trainingId = req.params.id;
//   const db = connection.promise();
//   let existingtraining = null;
//   db.query('SELECT * FROM training WHERE id = ?', [trainingId])
//     .then(([results]) => {
//       existingtraining = results[0];
//       if (!existingtraining) return Promise.reject('RECORD_NOT_FOUND');
//       return db.query('UPDATE training SET ? WHERE id = ?', [req.body, trainingId]);
//     })
//     .then(() => {
//       res.status(200).json({
//         ...existingtraining,
//         ...req.body
//       });
//     })
//     .catch((err) => {
//       console.error(err);
//       if (err === 'RECORD_NOT_FOUND')
//         res.status(404).send(`Training with id ${trainingId} not found.`);
//       else res.status(500).send('Error updating a training');
//     });
// });

// router.delete('/:id', (req, res) => {
//   connection.query(
//     'DELETE FROM training WHERE id = ?',
//     [req.params.id],
//     (err, result) => {
//       if (err) {
//         console.log(err);
//         res.status(500).send('Error deleting an training');
//       } else {
//         if (result.affectedRows) res.status(200).send('🎉 training deleted!');
//         else res.status(404).send('Training not found.');
//       }
//     }
//   );
// });

module.exports = router;