const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (request, response, next) => {
  try {
    const authorizationHeader = request.headers.authorization;

    if (
      !authorizationHeader ||
      !authorizationHeader.startsWith("Bearer ")
    ) {
      return response.status(401).json({
        message: "Authentication is required",
      });
    }

    const token = authorizationHeader.split(" ")[1];

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return response.status(401).json({
        message: "User no longer exists",
      });
    }

    request.user = user;
    next();
  } catch (error) {
    return response.status(401).json({
      message: "Invalid or expired authentication token",
    });
  }
};

const technicianOnly = (request, response, next) => {
  if (request.user.role !== "technician") {
    return response.status(403).json({
      message: "Technician access is required",
    });
  }

  next();
};

module.exports = {
  protect,
  technicianOnly,
};