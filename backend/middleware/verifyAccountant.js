const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

const verifyAccountant = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(401).json({ success: false, message: "Access denied" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.accountantId = decoded.accountantId;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

module.exports = { verifyAccountant };
