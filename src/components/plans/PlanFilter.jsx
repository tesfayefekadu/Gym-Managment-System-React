function PlanFilter({
  search,
  setSearch,
  status,
  setStatus,
  duration,
  setDuration,
  total,
  onReset,
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-end">

        {/* Search */}

        <div className="xl:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Plan
          </label>

          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by plan name..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <span className="absolute right-3 top-2.5 text-gray-400">
              🔍
            </span>
          </div>
        </div>

        {/* Status */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>
          </select>
        </div>

        {/* Duration */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration
          </label>

          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">
              All Durations
            </option>

            <option value="1 Month">
              1 Month
            </option>

            <option value="3 Months">
              3 Months
            </option>

            <option value="6 Months">
              6 Months
            </option>

            <option value="12 Months">
              12 Months
            </option>
          </select>
        </div>

        {/* Reset */}

        <div>
          <button
            type="button"
            onClick={onReset}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Result Count */}

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-800">
            {total}
          </span>{" "}
          {total === 1 ? "plan" : "plans"}
        </p>
      </div>
    </div>
  );
}

export default PlanFilter;