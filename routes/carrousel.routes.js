const router = require("express").Router();
const multer = require("multer");
const fs = require("fs");

const {
  findAll,
  insertCarrousel,
  deleteCarrousel,
  findOne,
} = require("../models/carrousel");

const upload = multer({ dest: "uploads/carrousel/" });

router.get("/", async (req, res) => {
  const [carrousel] = await findAll();
  res.json(carrousel);
});

router.get("/:id", async (req, res) => {
  const carrouselId = await findOne(req.params.id);
  res.json(carrouselId);
});

router.post("/", upload.single("image"), async (req, res) => {
  const [{ insertId: id }] = await insertCarrousel(req.body, req.file.path);
  return res.json({
    ...req.body,
    id,
    image: req.file.filename,
  });
});

router.delete("/:id", async (req, res) => {
  const carrouselId = await findOne(req.params.id).then((carrousel) => {
    console.log(carrousel.image);
    fs.unlink(`${carrousel.image}`, () => {
      const carrouselId = deleteCarrousel(req.params.id);
      res.json(carrouselId);
    });
  });
});

module.exports = router;
