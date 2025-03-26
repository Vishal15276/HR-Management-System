import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// User Schema & Model
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["HR", "Admin", "Employee", "Manager"], required: true },
});
const User = mongoose.model("User", UserSchema);

// Leave Schema & Model
const LeaveSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true },
    employeeName: { type: String, required: true },
    leaveType: { type: String, enum: ["Earned Leave", "Sick Leave", "Casual Leave"], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  },
  { timestamps: true }
);
const Leave = mongoose.model("Leave", LeaveSchema);

// Register User
app.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: "User already exists" });
  }
});

// Login User
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "strict", maxAge: 3600000 });
  res.json({ message: "Login successful", user });
});

// ✅ Fetch All Users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password for security
    res.json(users);
  } catch (err) {
    console.error("❌ Error Fetching Users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ✅ Add a New User (Admin Only)
app.post("/users", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    res.json({ message: "User added successfully" });
  } catch (err) {
    res.status(400).json({ error: "Error adding user" });
  }
});

// ✅ Update a User
app.put("/users/:id", async (req, res) => {
  const { name, email, role } = req.body;
  try {
    await User.findByIdAndUpdate(req.params.id, { name, email, role });
    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

// ✅ Delete a User
app.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Apply for Leave
app.post("/apply-leave", async (req, res) => {
  const { employeeId, employeeName, leaveType, startDate, endDate, reason } = req.body;

  if (!employeeId || !employeeName || !leaveType || !startDate || !endDate || !reason) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const leaveRequest = new Leave({
      employeeId,
      employeeName,
      leaveType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
    });
    await leaveRequest.save();
    res.json({ message: "Leave request submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to apply for leave" });
  }
});

// ✅ Get All Leave Requests (For Admin/HR)
app.get("/leave-requests", async (req, res) => {
  try {
    const leaveRequests = await Leave.find();
    res.json(leaveRequests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leave requests" });
  }
});

// ✅ Approve or Reject Leave Request
app.put("/approve-leave/:id", async (req, res) => {
  const { status } = req.body; // "Approved" or "Rejected"

  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    const leaveRequest = await Leave.findById(req.params.id);
    if (!leaveRequest) {
      return res.status(404).json({ error: "Leave request not found" });
    }

    leaveRequest.status = status;
    await leaveRequest.save();

    res.json({ message: `Leave request ${status.toLowerCase()} successfully` });
  } catch (err) {
    res.status(500).json({ error: "Failed to update leave status" });
  }
});

// ✅ Check if User is Logged In
app.get("/check-auth", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ isLoggedIn: false, role: "" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ isLoggedIn: true, role: decoded.role });
  } catch (err) {
    res.json({ isLoggedIn: false, role: "" });
  }
});
app.get("/leave-requests", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, "your_secret_key");
    const userId = decoded.userId;

    const leaveRequests = await Leave.find({ employeeId: userId });

    res.json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leave requests" });
  }
});
app.get("/leave-requests/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;
    const leaveRequests = await LeaveModel.find({ employeeId });
    res.json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leave requests." });
  }
});


// ✅ Logout User
app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
