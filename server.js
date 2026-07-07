const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());

// ================= MONGODB CONNECTION =================
mongoose.connect("mongodb://127.0.0.1:27017/houserent")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log("MongoDB Error:", err));

/* ======================================================
   USER SCHEMA (Tenant / Owner / Admin)
====================================================== */

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    default: "tenant" // tenant | owner | admin
  }
});

const User = mongoose.model("User", UserSchema);

/* ======================================================
   HOUSE SCHEMA (PROPERTY)
====================================================== */
const HouseSchema = new mongoose.Schema({
  id: Number,
  title: String,
  location: String,
  rent: Number,
  image: String,
  bed: String,
  bath: String,
  area: String,
  owner: String,
  phone: String,
  email: String,
  description: String,
  ownerId: String
});


const House = mongoose.model("House", HouseSchema);

/* ======================================================
   BOOKING SCHEMA (NEW - IMPORTANT)
====================================================== */

const BookingSchema = new mongoose.Schema({
  houseId: String,
  tenantId: String,
  ownerId: String,
  message: String,
  status: {
    type: String,
    default: "pending" // pending | accepted | rejected
  }
});

const Booking = mongoose.model("Booking", BookingSchema);

/* ======================================================
   HOME
====================================================== */

app.get("/houses/:id", async (req, res) => {
  try {
    const house = await House.findById(req.params.id);

    if (!house) {
      return res.status(404).send("House not found");
    }

    res.json(house);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching house");
  }
});

/* ======================================================
   REGISTER
====================================================== */

app.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.redirect("/login.html");
  } catch (err) {
    console.log(err);
    res.status(500).send("Registration Failed");
  }
});

/* ======================================================
   LOGIN
====================================================== */

app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      password: req.body.password
    });

    if (!user) {
      return res.send("Invalid Credentials");
    }

    // redirect based on role
    if (user.role === "owner") {
      res.redirect("/owner.html");
    } else if (user.role === "admin") {
      res.redirect("/admin.html");
    } else {
      res.redirect("/tenant.html");
    }

  } catch (err) {
    console.log(err);
    res.status(500).send("Login Failed");
  }
});

/* ======================================================
   ADD HOUSE (OWNER)
====================================================== */

app.post("/add-house", async (req, res) => {
  try {
    const house = new House(req.body);
    await house.save();
    res.redirect("/owner.html");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error Adding House");
  }
});

/* ======================================================
   GET ALL HOUSES (TENANT VIEW)
====================================================== */

app.get("/houses", async (req, res) => {
  try {
    const houses = await House.find();
    res.json(houses);
  } catch (err) {
    res.status(500).send("Error Fetching Houses");
  }
});

/* ======================================================
   BOOKING REQUEST (TENANT)
====================================================== */

app.post("/book", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.send("Booking Request Sent");
  } catch (err) {
    console.log(err);
    res.status(500).send("Booking Failed");
  }
});

/* ======================================================
   GET BOOKINGS (OWNER)
====================================================== */

app.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).send("Error Fetching Bookings");
  }
});

/* ======================================================
   UPDATE BOOKING STATUS (ACCEPT / REJECT)
====================================================== */

app.put("/booking/:id", async (req, res) => {
  try {
    const { status } = req.body;

    await Booking.findByIdAndUpdate(req.params.id, {
      status
    });

    res.send("Booking Updated");
  } catch (err) {
    res.status(500).send("Update Failed");
  }
});

/* ======================================================
   DELETE HOUSE
====================================================== */

app.delete("/delete/:id", async (req, res) => {
  try {
    await House.findByIdAndDelete(req.params.id);
    res.send("House Deleted");
  } catch (err) {
    res.status(500).send("Delete Failed");
  }
});

/* ======================================================
   START SERVER
====================================================== */

app.listen(5001, () => {
  console.log("Server running on http://localhost:5001");
});