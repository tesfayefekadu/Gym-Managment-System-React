function PlanHeader({ onAddPlan }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Membership Plans
        </h1>

        <p className="text-gray-500 mt-1">
          Manage gym membership plans and pricing
        </p>
      </div>

      <button
        onClick={onAddPlan}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
      >
        + Add Plan
      </button>

    </div>
  );
}

export default PlanHeader;