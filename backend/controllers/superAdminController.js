const School = require("../models/School");
const User = require("../models/User");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const sendEmail = require("../utils/sendEmail");

// @route GET /api/super-admin/dashboard
const getDashboard = async (req, res, next) => {
  try {
    const [totalSchools, pendingApprovals, approvedSchools, rejectedSchools] =
      await Promise.all([
        School.countDocuments(),
        School.countDocuments({ status: "pending" }),
        School.countDocuments({ status: "approved" }),
        School.countDocuments({ status: "rejected" }),
      ]);

    const recentSchools = await School.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      stats: { totalSchools, pendingApprovals, approvedSchools, rejectedSchools },
      recentSchools,
    });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/super-admin/schools
// Onboard a new school. Also creates its first School Admin user.
const onboardSchool = async (req, res, next) => {
  try {
    const {
      name,
      address,
      city,
      state,
      contactEmail,
      contactPhone,
      principalName,
      adminName,
      adminEmail,
      adminPassword,
    } = req.body;

    if (!name || !address || !city || !state || !contactEmail || !contactPhone) {
      return res.status(400).json({ message: "Missing required school fields" });
    }
    if (!adminName || !adminEmail || !adminPassword) {
      return res.status(400).json({ message: "School admin details are required" });
    }

    const school = await School.create({
      name,
      address,
      city,
      state,
      contactEmail,
      contactPhone,
      principalName,
      status: "pending",
      onboardedBy: req.user._id,
    });

    await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: "schooladmin",
      school: school._id,
    });

    res.status(201).json({ message: "School onboarded, pending approval", school });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/super-admin/schools?status=pending
const listSchools = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const schools = await School.find(filter).sort({ createdAt: -1 });
    res.json(schools);
  } catch (err) {
    next(err);
  }
};

// @route PATCH /api/super-admin/schools/:id/approve
const approveSchool = async (req, res, next) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) return res.status(404).json({ message: "School not found" });

    school.status = "approved";
    school.approvedAt = new Date();
    school.rejectionReason = null;
    await school.save();

    const admin = await User.findOne({ school: school._id, role: "schooladmin" });
    if (admin) {
      try {
        await sendEmail({
          to: admin.email,
          subject: "Your school has been approved on Smansys",
          html: `<p>Hi ${admin.name},</p><p>${school.name} has been approved. You can now log in to the School Admin dashboard.</p>`,
        });
      } catch (emailErr) {
        console.error("Approval email failed:", emailErr.message);
        // Don't fail the request just because the email didn't send
      }
    }

    res.json({ message: "School approved", school });
  } catch (err) {
    next(err);
  }
};

// @route PATCH /api/super-admin/schools/:id/reject
const rejectSchool = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const school = await School.findById(req.params.id);
    if (!school) return res.status(404).json({ message: "School not found" });

    school.status = "rejected";
    school.rejectionReason = reason || "Not specified";
    await school.save();

    res.json({ message: "School rejected", school });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboard,
  onboardSchool,
  listSchools,
  approveSchool,
  rejectSchool,
};
