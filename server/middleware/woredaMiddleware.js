const requireWoreda = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  // Admin is allowed to access all Woredas
  if (req.user.role === "Admin") {
    return next();
  }

  // Manager and Staff must belong to a Woreda
  if (
    (req.user.role === "Manager" || req.user.role === "Staff") &&
    !req.user.woreda_id
  ) {
    return res.status(403).json({
      message: "User is not assigned to a Woreda",
    });
  }

  next();
};

module.exports = requireWoreda;