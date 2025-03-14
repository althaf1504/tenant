const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://althaf1504:<OmSe5kO1WMCB3XyK>@tenantdb.v8b3d.mongodb.net/?retryWrites=true&w=majority&appName=TenantDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));


const tenantSchema = new mongoose.Schema({
  name: String,
  dob: String,
  address: String,
  purpose: String,
  rentAmount: Number,
  idProof: String, // File URL or Base64
  lastPaidMonth: String,
});

const Tenant = mongoose.model("Tenant", tenantSchema);

// Add Tenant
app.post("/tenants", async (req, res) => {
  const tenant = new Tenant(req.body);
  await tenant.save();
  res.json({ message: "Tenant added successfully" });
});

// Get All Tenants
app.get("/tenants", async (req, res) => {
  const tenants = await Tenant.find();
  res.json(tenants);
});

// Get Overdue Tenants
app.get("/tenants/overdue", async (req, res) => {
  const overdue = await Tenant.find({ lastPaidMonth: { $ne: "February 2025" } }); // Update dynamically
  res.json(overdue);
});

// Update Tenant Payment
app.put("/tenants/:id/pay", async (req, res) => {
  await Tenant.findByIdAndUpdate(req.params.id, { lastPaidMonth: req.body.month });
  res.json({ message: "Payment updated" });
});

// Delete Tenant
app.delete("/tenants/:id", async (req, res) => {
  await Tenant.findByIdAndDelete(req.params.id);
  res.json({ message: "Tenant removed" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
