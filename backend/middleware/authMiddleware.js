import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("User not found. Please log in again.");
      }

      return next();
    } catch (error) {
      res.status(401);
      return next(new Error("Not authorized. Invalid or expired token."));
    }
  }

  res.status(401);
  return next(new Error("Not authorized. No token provided."));
};
