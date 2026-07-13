require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const School = require("./models/School");
const Teacher = require("./models/Teacher");
const Student = require("./models/Student");
const FeeStructure = require("./models/FeeStructure");

const seed = async () => {
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany({}),
    School.deleteMany({}),
    Teacher.deleteMany({}),
    Student.deleteMany({}),
    FeeStructure.deleteMany({}),
  ]);

  console.log("Creating super admin...");
  const superAdmin = await User.create({
    name: "Super Admin",
    email: "superadmin@smansys.com",
    password: "Password123",
    role: "superadmin",
  });

  console.log("Creating schools...");
  const greenwood = await School.create({
    name: "Greenwood High School",
    address: "12 MG Road",
    city: "Bengaluru",
    state: "Karnataka",
    contactEmail: "contact@greenwood.edu",
    contactPhone: "9876543210",
    principalName: "Dr. Anita Rao",
    status: "approved",
    approvedAt: new Date(),
    onboardedBy: superAdmin._id,
  });

  const sunrise = await School.create({
    name: "Sunrise Public School",
    address: "45 Sector 21",
    city: "Noida",
    state: "Uttar Pradesh",
    contactEmail: "contact@sunrise.edu",
    contactPhone: "9876500000",
    principalName: "Mr. Rakesh Verma",
    status: "pending",
    onboardedBy: superAdmin._id,
  });

  console.log("Creating school admins...");
  await User.create({
    name: "Greenwood Admin",
    email: "admin@greenwood.edu",
    password: "Password123",
    role: "schooladmin",
    school: greenwood._id,
  });

  await User.create({
    name: "Sunrise Admin",
    email: "admin@sunrise.edu",
    password: "Password123",
    role: "schooladmin",
    school: sunrise._id,
  });

  console.log("Creating teachers for Greenwood...");
  await Teacher.insertMany([
    { name: "Priya Sharma", email: "priya.sharma@greenwood.edu", subject: "Mathematics", qualification: "M.Sc", school: greenwood._id },
    { name: "Rahul Mehta", email: "rahul.mehta@greenwood.edu", subject: "Science", qualification: "M.Sc", school: greenwood._id },
    { name: "Sneha Iyer", email: "sneha.iyer@greenwood.edu", subject: "English", qualification: "M.A", school: greenwood._id },
  ]);

  console.log("Creating students for Greenwood...");
  await Student.insertMany([
    { name: "Aarav Kumar", rollNumber: "GW001", class: "5", section: "A", parentName: "Vikram Kumar", parentEmail: "vikram.kumar@example.com", parentPhone: "9000000001", school: greenwood._id },
    { name: "Diya Patel", rollNumber: "GW002", class: "5", section: "A", parentName: "Nisha Patel", parentEmail: "nisha.patel@example.com", parentPhone: "9000000002", school: greenwood._id },
    { name: "Kabir Singh", rollNumber: "GW003", class: "6", section: "B", parentName: "Harpreet Singh", parentEmail: "harpreet.singh@example.com", parentPhone: "9000000003", school: greenwood._id },
  ]);

  console.log("Creating fee structure for Greenwood...");
  await FeeStructure.insertMany([
    { school: greenwood._id, class: "5", feeType: "Tuition", amount: 5000, frequency: "Monthly", dueDate: new Date("2026-08-05") },
    { school: greenwood._id, class: "6", feeType: "Tuition", amount: 5500, frequency: "Monthly", dueDate: new Date("2026-08-05") },
    { school: greenwood._id, class: "5", feeType: "Transport", amount: 1500, frequency: "Monthly", dueDate: new Date("2026-08-05") },
  ]);

  console.log("\nSeed complete!\n");
  console.log("Login credentials:");
  console.log("  Super Admin  -> superadmin@smansys.com / Password123");
  console.log("  School Admin (approved, Greenwood) -> admin@greenwood.edu / Password123");
  console.log("  School Admin (pending, Sunrise)     -> admin@sunrise.edu / Password123 (blocked until approved)");

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
