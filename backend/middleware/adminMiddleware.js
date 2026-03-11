const adminMiddleware = (req, res, next) => {
  // Check if user is admin
  // Assuming req.user is set by authMiddleware and has a role property
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admin privileges required." });
  }
};

module.exports = adminMiddleware;
