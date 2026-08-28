const membershipService = {
  // Get all membership plans
  getAll: async () => {
    // Temporary local implementation
    // Later this will call:
    // GET /api/membership-plans

    return [];
  },

  // Get one membership plan
  getById: async (id) => {
    // Later:
    // GET /api/membership-plans/:id

    return null;
  },

  // Create membership plan
  create: async (planData) => {
    // Later:
    // POST /api/membership-plans

    return planData;
  },

  // Update membership plan
  update: async (id, planData) => {
    // Later:
    // PUT /api/membership-plans/:id

    return {
      id,
      ...planData,
    };
  },

  // Delete membership plan
  remove: async (id) => {
    // Later:
    // DELETE /api/membership-plans/:id

    return {
      success: true,
      id,
    };
  },
};

export default membershipService;