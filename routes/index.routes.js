const router = require("express").Router();
const userRouter = require("./user.routes");
const carrouselRouter = require("./carrousel.routes");
const trainingRouter = require("./training.routes");
const training_categoryRouter = require("./training_category.routes");

router.use("/user", userRouter);
router.use("/carrousel", carrouselRouter);
router.use("/training", trainingRouter);
router.use("/training_category", training_categoryRouter);

module.exports = router;
