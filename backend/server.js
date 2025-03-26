import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // Consider replacing this if not preferred
import cookieParser from "cookie-parser"; // For secure token storage

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Exit if DB connection fails
  });

// ✅ User Schema & Model
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["HR", "Admin", "Employee", "Manager"], required: true },
});

const User = mongoose.model("User", UserSchema);

// ✅ Leave Schema & Model with timestamps
const LeaveSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    employeeName: { type: String, required: true },
    leaveType: { type: String, enum: ["Earned Leave", "Sick Leave", "Casual Leave"], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  },
  { timestamps: true } // ✅ Adds createdAt & updatedAt fields
);

const Leave = mongoose.model("Leave", LeaveSchema);

// ✅ Secure Registration Route
app.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!["HR", "Admin", "Employee", "Manager"].includes(role)) {
    return res.status(400).json({ error: "Invalid role selected" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: "User already exists" });
  }
});

// ✅ Secure Login Route with JWT Cookie
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // ✅ Store token securely in cookies
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3600000, // 1 hour
  });

  res.json({ message: "Login successful", user });
});

// ✅ Leave Application with Validation & Debugging Logs
app.post("/apply-leave", async (req, res) => {
  const { employeeId, employeeName, leaveType, startDate, endDate, reason } = req.body;

  console.log("📝 Received Leave Request:", req.body);

  if (!employeeId || !employeeName || !leaveType || !startDate || !endDate || !reason) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // ✅ Ensure employeeId is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    return res.status(400).json({ error: "Invalid Employee ID" });
  }

  // ✅ Convert dates to JavaScript Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);

  // ✅ Prevent applying leave for past dates
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Ignore time part
  if (start < today) {
    return res.status(400).json({ error: "Cannot apply leave for past dates" });
  }

  try {
    // ✅ Check if Employee exists
    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // ✅ Save Leave Request
    const leaveRequest = new Leave({
      employeeId,
      employeeName,
      leaveType,
      startDate: start,
      endDate: end,
      reason,
    });

    await leaveRequest.save();
    console.log("✅ Leave Request Saved:", leaveRequest);

    res.json({ message: "Leave request submitted successfully" });
  } catch (err) {
    console.error("❌ Error Applying Leave:", err);
    res.status(500).json({ error: "Failed to apply for leave" });
  }
});

// ✅ Get All Leave Requests
app.get("/leave-requests", async (req, res) => {
  try {
    const leaveRequests = await Leave.find().populate("employeeId", "name email role");
    res.json(leaveRequests);
  } catch (err) {
    console.error("❌ Error Fetching Leave Requests:", err);
    res.status(500).json({ error: "Failed to fetch leave requests" });
  }
});

// ✅ Logout Route
app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
