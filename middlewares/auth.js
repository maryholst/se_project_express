const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { INTERNAL_SERVER_ERROR, UNAUTHORIZED } = require("../utils/errors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (typeof authorization !== "string" || !authorization.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Authorization required" });
  }

  if (!JWT_SECRET) {
    console.error(new Error("JWT_SECRET environment variable is not configured"));
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }

  let payload;
  try {
    payload = jwt.verify(authorization.slice(7), JWT_SECRET);
  } catch (err) {
    return res.status(UNAUTHORIZED).send({ message: "Authorization required" });
  }

  if (!payload || typeof payload !== "object" || typeof payload._id !== "string") {
    return res.status(UNAUTHORIZED).send({ message: "Authorization required" });
  }

  req.user = payload;
  return next();
};
