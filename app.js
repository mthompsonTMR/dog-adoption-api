const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db");
const cors = require("cors");

dotenv.config();
console.log("JWT_secret IS", process.env.JWT_SECRET)
connectDB();

const app = express();
app.use(cors());

app.use(express.json());
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/dogs", require("./routes/dogRoutes"));

// Sample route
app.get("/", (req, res) => {
  res.send("Dog Adoption API is live!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
module.exports = app;
