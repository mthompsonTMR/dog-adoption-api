const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
      
    try {
  token = req.headers.authorization.split(" ")[1];
  console.log(" Raw token from header:", token);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log("Token decoded:", decoded);

  req.user = await User.findById(decoded.id).select("-password");
  console.log(" User found:", req.user.email);

  return next();
} catch (err) {
  console.error(" JWT VERIFY ERROR:", err.message); // Fixed line here
  return res.status(401).json({ error: "Token failed", detail: err.message });
}

  } else {
    console.log(" No authorization header received.");
    return res.status(401).json({ error: "No token provided" });
  }
};

module.exports = protect;

