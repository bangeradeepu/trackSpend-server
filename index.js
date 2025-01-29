const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5000;




app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// MongoDB Connect
mongoose.connect(
    process.env.DB_HOST
);

const spendSchema = new mongoose.Schema({
  spendName: String,
  spendMoney: String,
  createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now },
});

const spendsAdapter = mongoose.model("spends", spendSchema);

const savingSchema = new mongoose.Schema({
  savingName: String,
  savingMoney: String,
  createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now },
});

const savingAdapter = mongoose.model("savings", savingSchema);

// CRUD Operations for Spends
app.get("/api/spends", async (req, res) => {
  try {
    const getSpends = await spendsAdapter.find();
    res.status(200).json(getSpends);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post("/api/spends", async (req, res) => {
  try {
    const { spendName, spendMoney } = req.body;
    const postData = new spendsAdapter({ spendName, spendMoney });
    const saveData = await postData.save();
    res.status(200).json(saveData);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.put("/api/spends/:id", async (req, res) => {
  try {
    const { spendName, spendMoney } = req.body;
    const editPayload = await spendsAdapter.findByIdAndUpdate(
      req.params.id,
      { spendName, spendMoney, modifiedAt: Date.now() },
      { new: true }
    );
    if (!editPayload) {
      return res.status(404).json({ success: false, message: "Spend not found" });
    }
    res.status(200).json(editPayload);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.delete("/api/spends/:id", async (req, res) => {
  try {
    const deleteData = await spendsAdapter.findByIdAndDelete(req.params.id);
    if (!deleteData) {
      return res.status(404).json({ success: false, message: "Spend not found" });
    }
    res.status(200).json(deleteData);
  } catch (error) {
    res.status(500).json(error);
  }
});

// CRUD Operations for Savings
app.get("/api/savings", async (req, res) => {
  try {
    const getSavings = await savingAdapter.find();
    res.status(200).json(getSavings);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post("/api/savings", async (req, res) => {
  try {
    const { savingName, savingMoney } = req.body;
    const postData = new savingAdapter({ savingName, savingMoney });
    const saveData = await postData.save();
    res.status(200).json(saveData);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.put("/api/savings/:id", async (req, res) => {
  try {
    const { savingName, savingMoney } = req.body;
    const editPayload = await savingAdapter.findByIdAndUpdate(
      req.params.id,
      { savingName, savingMoney, modifiedAt: Date.now() },
      { new: true }
    );
    if (!editPayload) {
      return res.status(404).json({ success: false, message: "Saving not found" });
    }
    res.status(200).json(editPayload);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.delete("/api/savings/:id", async (req, res) => {
  try {
    const deleteData = await savingAdapter.findByIdAndDelete(req.params.id);
    if (!deleteData) {
      return res.status(404).json({ success: false, message: "Saving not found" });
    }
    res.status(200).json(deleteData);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});