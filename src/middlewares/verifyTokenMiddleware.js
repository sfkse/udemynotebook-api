const jwt = require("jsonwebtoken");

const verifyTokenMiddleware = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({
      status: "error",
      message: "You are not logged in",
    });
  }

  const token = authorizationHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Token is not provided",
    });
  }

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({
        status: "error",
        message: "Token is not verified",
      });
    req.user = user;
  });

  next();
};

module.exports = { verifyTokenMiddleware };

