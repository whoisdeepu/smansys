const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/roleCheck");
const {
  getDashboard,
  onboardSchool,
  listSchools,
  approveSchool,
  rejectSchool,
} = require("../controllers/superAdminController");

// All routes here require a logged-in Super Admin
router.use(protect, authorize("superadmin"));

router.get("/dashboard", getDashboard);
router.post("/schools", onboardSchool);
router.get("/schools", listSchools);
router.patch("/schools/:id/approve", approveSchool);
router.patch("/schools/:id/reject", rejectSchool);

module.exports = router;
