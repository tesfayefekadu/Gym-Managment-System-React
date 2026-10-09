const getWoredaScope = (req) => {
  if (!req.user) {
    throw new Error("Authenticated user is required");
  }

  // Admin can access all Woredas
  if (req.user.role === "Admin") {
    return null;
  }

  return req.user.woreda_id;
};

module.exports = getWoredaScope;