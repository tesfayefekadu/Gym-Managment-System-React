function MemberFilter({
  searchTerm,
  onSearch,
  planFilter,
  onPlanChange,
  statusFilter,
  onStatusChange,
  totalMembers,
  onReset,
}) {
  return (
    <div className="bg-white shadow rounded-xl p-5 mb-6">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* ==========================
            Search
            ========================== */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Search
          </label>

          <input
            type="text"
            placeholder="Search name or phone..."
            value={searchTerm}
            onChange={(e) =>
              onSearch(e.target.value)
            }
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* ==========================
            Membership Plan
            ========================== */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Membership Plan
          </label>

          <select
            value={planFilter}
            onChange={(e) =>
              onPlanChange(e.target.value)
            }
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="All">
              All Plans
            </option>

            <option value="Basic">
              Basic
            </option>

            <option value="Standard">
              Standard
            </option>

            <option value="Premium">
              Premium
            </option>

            <option value="VIP">
              VIP
            </option>
          </select>
        </div>

        {/* ==========================
            Status
            ========================== */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Status
          </label>

          <select
            value={statusFilter}
            onChange={(e) =>
              onStatusChange(e.target.value)
            }
            className="w-full border rounded-lg px-4 py-2"
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

        {/* ==========================
            Reset
            ========================== */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={onReset}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* ==========================
          Total Members
          ========================== */}
      <div className="mt-5 flex justify-between items-center">
        <p className="text-gray-600">
          Total Members:

          <span className="font-bold ml-2">
            {totalMembers}
          </span>
        </p>
      </div>

    </div>
  );
}

export default MemberFilter;