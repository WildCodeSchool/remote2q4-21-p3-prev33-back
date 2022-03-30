const router = require("express").Router();
const multer = require("multer");
const fs = require("fs");

const {
  findAll,
  insertCarrousel,
  deleteCarrousel,
  findOne,
} = require("../models/carrousel");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/carrousel/");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, `${name}_${Date.now()}.${extension}`);
  },
});

router.get("/", async (req, res) => {
  const [carrousel] = await findAll();
  res.json(carrousel);
});

router.get("/:id", async (req, res) => {
  const carrouselId = await findOne(req.params.id);
  res.json(carrouselId);
});

router.post("/", multer({ storage }).single("image"), async (req, res) => {
  const [{ insertId: id }] = await insertCarrousel(req.body, req.file.path);
  return res.json({
    ...req.body,
    id,
    image: req.file.filename,
  });
});

router.delete("/:id", async (req, res) => {
  const carrouselId = await findOne(req.params.id).then((carrousel) => {
    fs.unlink(`${carrousel.image}`, () => {
      const carrouselId = deleteCarrousel(req.params.id);
      res.json(carrouselId);
    });
  });
});

module.exports = router;
