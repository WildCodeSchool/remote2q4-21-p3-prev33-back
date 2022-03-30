const router = require("express").Router();
const multer = require("multer");
const fs = require("fs");

const { findAll, findOne, insertFile, deleteFile } = require("../models/files");

const MIME_TYPES = {
  "application/pdf": "pdf",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/files/");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, `${name}_${Date.now()}.${extension}`);
  },
});

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

router.post("/", multer({ storage }).single("link"), async (req, res) => {
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
