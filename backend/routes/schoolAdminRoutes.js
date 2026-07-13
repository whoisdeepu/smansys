const express = require("express");
const multer = require("multer");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/roleCheck");
const {
  getDashboard,
  importTeachers,
  importStudents,
  listTeachers,
  listStudents,
  createFeeStructure,
  listFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
  sendFeeReminders,
} = require("../controllers/schoolAdminController");

const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "text/csv" && !file.originalname.endsWith(".csv")) {
      return cb(new Error("Only CSV files are allowed"));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// All routes here require a logged-in School Admin
router.use(protect, authorize("schooladmin"));

router.get("/dashboard", getDashboard);

router.post("/teachers/import", upload.single("file"), importTeachers);
router.get("/teachers", listTeachers);

router.post("/students/import", upload.single("file"), importStudents);
router.get("/students", listStudents);

router.post("/fee-structure", createFeeStructure);
router.get("/fee-structure", listFeeStructure);
router.put("/fee-structure/:id", updateFeeStructure);
router.delete("/fee-structure/:id", deleteFeeStructure);
router.post("/fee-structure/:id/send-reminders", sendFeeReminders);

module.exports = router;
