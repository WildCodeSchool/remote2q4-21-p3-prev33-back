const connection = require("../db-config");
const router = require("express").Router();
const multer = require("multer");
const fs = require("fs");

const { findAll, findOne, insertFile, deleteFile } = require("../models/files");

const upload = multer({ dest: "uploads/files/" });

router.get("/", async (req, res) => {
  const [training] = await findAll();
  res.json(training);
});

router.get("/:id", async (req, res) => {
  const trainingId = await findOne(req.params.id);
  res.json(trainingId);
});

router.get("/training/:title", (req, res) => {
  const trainingTitle = req.params.title;
  connection.query(
    "SELECT * FROM training WHERE title= ?",
    [trainingTitle],
    (err, results) => {
      if (err) {
        res.status(500).send("Error retrieving training title from database");
      } else {
        if (results.length) res.json(results[0]);
        else res.status(404).send("Training title not found");
      }
    }
  );
});

router.post("/", upload.single("link"), async (req, res) => {
  const [{ insertId: id }] = await insertFile(req.body, req.file.path);
  return res.json({
    ...req.body,
    id,
    link: req.file.filename,
  });
});

router.delete("/:id", async (req, res) => {
  const trainingId = await findOne(req.params.id).then((file) => {
    fs.unlink(`${file.link}`, () => {
      const trainingId = deleteFile(req.params.id);
      res.json(trainingId);
    });
  });
});

module.exports = router;
