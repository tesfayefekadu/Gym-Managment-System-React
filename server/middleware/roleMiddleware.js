// ========================================
// ROLE AUTHORIZATION MIDDLEWARE
// ========================================

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // User should already be authenticated
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    // Check user's role
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action",
      });
    }

    next();
  };
};

module.exports = authorizeRoles;