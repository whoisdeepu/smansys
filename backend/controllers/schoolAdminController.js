const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const FeeStructure = require("../models/FeeStructure");
const FeeReminderLog = require("../models/FeeReminderLog");
const { parseCSV } = require("../utils/csvImporter");
const sendEmail = require("../utils/sendEmail");

// @route GET /api/school-admin/dashboard
const getDashboard = async (req, res, next) => {
  try {
    const schoolId = req.user.school;

    const [totalStudents, totalTeachers, feeStructuresCount] = await Promise.all([
      Student.countDocuments({ school: schoolId }),
      Teacher.countDocuments({ school: schoolId }),
      FeeStructure.countDocuments({ school: schoolId }),
    ]);

    const recentReminders = await FeeReminderLog.find({ school: schoolId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("student", "name rollNumber");

    res.json({
      stats: { totalStudents, totalTeachers, feeStructuresCount },
      recentReminders,
    });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/school-admin/teachers/import   (multipart/form-data, field name: file)
const importTeachers = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "CSV file is required" });

    const rows = await parseCSV(req.file.path);
    const schoolId = req.user.school;

    const results = { successCount: 0, failedRows: [] };

    for (const [index, row] of rows.entries()) {
      try {
        if (!row.name || !row.email || !row.subject) {
          throw new Error("Missing required fields (name, email, subject)");
        }
        await Teacher.create({
          name: row.name,
          email: row.email.toLowerCase(),
          phone: row.phone || "",
          subject: row.subject,
          qualification: row.qualification || "",
          school: schoolId,
        });
        results.successCount++;
      } catch (rowErr) {
        results.failedRows.push({ row: index + 2, reason: rowErr.message }); // +2 = header + 1-indexed
      }
    }

    res.status(201).json({
      message: `Import complete: ${results.successCount} added, ${results.failedRows.length} failed`,
      ...results,
    });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/school-admin/students/import   (multipart/form-data, field name: file)
const importStudents = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "CSV file is required" });

    const rows = await parseCSV(req.file.path);
    const schoolId = req.user.school;

    const results = { successCount: 0, failedRows: [] };

    for (const [index, row] of rows.entries()) {
      try {
        if (!row.name || !row.rollNumber || !row.class || !row.parentEmail) {
          throw new Error("Missing required fields (name, rollNumber, class, parentEmail)");
        }
        await Student.create({
          name: row.name,
          rollNumber: row.rollNumber,
          class: row.class,
          section: row.section || "A",
          parentName: row.parentName || "",
          parentEmail: row.parentEmail.toLowerCase(),
          parentPhone: row.parentPhone || "",
          school: schoolId,
        });
        results.successCount++;
      } catch (rowErr) {
        results.failedRows.push({ row: index + 2, reason: rowErr.message });
      }
    }

    res.status(201).json({
      message: `Import complete: ${results.successCount} added, ${results.failedRows.length} failed`,
      ...results,
    });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/school-admin/teachers
const listTeachers = async (req, res, next) => {
  try {
    const teachers = await Teacher.find({ school: req.user.school }).sort({ name: 1 });
    res.json(teachers);
  } catch (err) {
    next(err);
  }
};

// @route GET /api/school-admin/students
const listStudents = async (req, res, next) => {
  try {
    const students = await Student.find({ school: req.user.school }).sort({ name: 1 });
    res.json(students);
  } catch (err) {
    next(err);
  }
};

// @route POST /api/school-admin/fee-structure
const createFeeStructure = async (req, res, next) => {
  try {
    const { class: className, feeType, amount, frequency, dueDate } = req.body;
    if (!className || !feeType || !amount || !dueDate) {
      return res.status(400).json({ message: "Missing required fee structure fields" });
    }

    const fee = await FeeStructure.create({
      school: req.user.school,
      class: className,
      feeType,
      amount,
      frequency,
      dueDate,
    });

    res.status(201).json(fee);
  } catch (err) {
    next(err);
  }
};

// @route GET /api/school-admin/fee-structure
const listFeeStructure = async (req, res, next) => {
  try {
    const fees = await FeeStructure.find({ school: req.user.school }).sort({ class: 1 });
    res.json(fees);
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/school-admin/fee-structure/:id
const updateFeeStructure = async (req, res, next) => {
  try {
    const fee = await FeeStructure.findOneAndUpdate(
      { _id: req.params.id, school: req.user.school },
      req.body,
      { new: true, runValidators: true }
    );
    if (!fee) return res.status(404).json({ message: "Fee structure not found" });
    res.json(fee);
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/school-admin/fee-structure/:id
const deleteFeeStructure = async (req, res, next) => {
  try {
    const fee = await FeeStructure.findOneAndDelete({
      _id: req.params.id,
      school: req.user.school,
    });
    if (!fee) return res.status(404).json({ message: "Fee structure not found" });
    res.json({ message: "Fee structure deleted" });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/school-admin/fee-structure/:id/send-reminders
// Sends a reminder email to every student's parent for a given class's fee structure
const sendFeeReminders = async (req, res, next) => {
  try {
    const fee = await FeeStructure.findOne({
      _id: req.params.id,
      school: req.user.school,
    });
    if (!fee) return res.status(404).json({ message: "Fee structure not found" });

    const students = await Student.find({ school: req.user.school, class: fee.class });

    if (students.length === 0) {
      return res.status(404).json({ message: "No students found for this class" });
    }

    const results = { sent: 0, failed: 0 };

    for (const student of students) {
      try {
        await sendEmail({
          to: student.parentEmail,
          subject: `Fee Payment Reminder - ${fee.class}`,
          html: `<p>Dear ${student.parentName || "Parent"},</p>
                 <p>This is a reminder that the <strong>${fee.feeType}</strong> fee of
                 <strong>₹${fee.amount}</strong> for ${student.name} (Roll No: ${student.rollNumber})
                 is due on ${new Date(fee.dueDate).toLocaleDateString()}.</p>
                 <p>Please make the payment at your earliest convenience.</p>`,
        });
        await FeeReminderLog.create({
          school: req.user.school,
          student: student._id,
          parentEmail: student.parentEmail,
          feeStructure: fee._id,
          status: "sent",
        });
        results.sent++;
      } catch (emailErr) {
        await FeeReminderLog.create({
          school: req.user.school,
          student: student._id,
          parentEmail: student.parentEmail,
          feeStructure: fee._id,
          status: "failed",
          errorMessage: emailErr.message,
        });
        results.failed++;
      }
    }

    res.json({
      message: `Reminders sent: ${results.sent}, failed: ${results.failed}`,
      ...results,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
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
};
