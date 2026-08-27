import InputField from "../common/InputField";
import Button from "../common/Button";

function AttendanceFilter({
  search,
  setSearch,
  dateFilter,
  setDateFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  status,
  setStatus,
  onReset,
  total,
}) {
  return (
    <div className="bg-white rounded-xl shadow p-5 mb-6">

      {/* ==========================
          Filters
      ========================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Search */}

        <InputField
          label="Search Member"
          name="search"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Name, phone or ID..."
        />

        {/* Date Filter */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Filter
          </label>

          <select
            value={dateFilter}
            onChange={(e) =>
              setDateFilter(e.target.value)
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">
              All Dates
            </option>

            <option value="today">
              Today
            </option>

            <option value="specific">
              Specific Date
            </option>

            <option value="range">
              Date Range
            </option>
          </select>
        </div>

        {/* Status */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">
              All Status
            </option>

            <option value="Present">
              Present
            </option>

            <option value="Absent">
              Absent
            </option>

            <option value="Late">
              Late
            </option>
          </select>
        </div>

        {/* Specific Date */}

        {dateFilter === "specific" && (
          <InputField
            label="Select Date"
            type="date"
            name="specificDate"
            value={startDate}
            onChange={(e) =>
              setStartDate(e.target.value)
            }
          />
        )}

        {/* Start Date */}

        {dateFilter === "range" && (
          <InputField
            label="From Date"
            type="date"
            name="startDate"
            value={startDate}
            onChange={(e) =>
              setStartDate(e.target.value)
            }
          />
        )}

        {/* End Date */}

        {dateFilter === "range" && (
          <InputField
            label="To Date"
            type="date"
            name="endDate"
            value={endDate}
            onChange={(e) =>
              setEndDate(e.target.value)
            }
          />
        )}

      </div>

      {/* ==========================
          Bottom Toolbar
      ========================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-5 pt-4 border-t">

        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-700">
            {total}
          </span>{" "}
          attendance record
          {total !== 1 ? "s" : ""}
        </p>

        <Button
          variant="secondary"
          onClick={onReset}
        >
          Reset Filters
        </Button>

      </div>

    </div>
  );
}

export default AttendanceFilter;