const express = require("express");
const {
  getCampgrounds,
  getCampground,
  createCampground,
  updateCampground,
  deleteCampground,
} = require("../controllers/campgrounds");

/*
//Include other resource routers
const appointmentRouter = require("./reservations");
*/

const router = express.Router();
//const { protect, authorize } = require("../middleware/auth");

/*
//Re-route into other resource routers
router.use("/:hospitalId/appointments/", appointmentRouter);
*/

router.route("/").get(getCampgrounds).post(createCampground);
router
  .route("/:id")
  .get(getCampground)
  .put(updateCampground)
  .delete(deleteCampground);

module.exports = router;
