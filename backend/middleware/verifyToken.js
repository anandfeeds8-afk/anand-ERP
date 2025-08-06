const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token)
    return res
      .status(401)
      .json({ msg: "From middleware: No token, authorization denied" });

  try {
    const decodedUser = jwt.verify(token, SECRET);
    req.user = decodedUser;
    next();
  } catch (err) {
    res.status(401).json({ msg: "From middleware: Token is not valid" });
  }
};

module.exports = verifyToken;
