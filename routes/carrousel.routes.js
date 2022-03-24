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
  const carrouselId = await deleteCarrousel(req.params.id);
  fs.unlink(req.file.filename, (err) => {
    if (err) throw err;
    console.log("image supprimée");
    res.json(carrouselId);
  });
});

// router.put("/:id", (req, res) => {
//   const carrouselId = req.params.id;
//   const db = connection.promise();
//   let existingcarrousel = null;
//   db.query("SELECT * FROM carrousel WHERE id = ?", [carrouselId])
//     .then(([results]) => {
//       existingcarrousel = results[0];
//       if (!existingcarrousel) return Promise.reject("RECORD_NOT_FOUND");
//       return db.query("UPDATE carrousel SET ? WHERE id = ?", [
//         req.body,
//         carrouselId,
//       ]);
//     })
//     .then(() => {
//       res.status(200).json({ ...existingcarrousel, ...req.body });
//     })
//     .catch((err) => {
//       console.error(err);
//       if (err === "RECORD_NOT_FOUND")
//         res.status(404).send(`carrousel with id ${carrouselId} not found.`);
//       else res.status(500).send("Error updating a carrousel");
//     });
// });

// router.delete("/:id", (req, res) => {
//   connection.query(
//     "DELETE FROM carrousel WHERE id = ?",
//     [req.params.id],
//     (err, result) => {
//       if (err) {
//         console.log(err);
//         res.status(500).send("Error deleting an carrousel");
//       } else {
//         if (result.affectedRows) res.status(200).send("🎉 carrousel deleted!");
//         else res.status(404).send("carrousel not found.");
//       }
//     }
//   );
// });

module.exports = router;
