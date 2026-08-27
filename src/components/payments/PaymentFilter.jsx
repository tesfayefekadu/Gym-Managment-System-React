import InputField from "../common/InputField";
import SelectField from "../common/SelectField";
import Button from "../common/Button";

function PaymentFilter({
  search,
  setSearch,
  method,
  setMethod,
  status,
  setStatus,
  onReset,
  total,
}) {
  return (
    <div className="bg-white rounded-xl shadow p-5 mb-6">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

        {/* Search */}

        <InputField
          label="Search"
          name="search"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Member or reference..."
        />

        {/* Method */}

        <SelectField
          label="Payment Method"
          name="method"
          value={method}
          onChange={(e) =>
            setMethod(e.target.value)
          }
          options={[
            {
              value: "All",
              label: "All Methods",
            },
            {
              value: "Cash",
              label: "Cash",
            },
            {
              value: "Bank Transfer",
              label: "Bank Transfer",
            },
            {
              value: "Mobile Money",
              label: "Mobile Money",
            },
            {
              value: "Card",
              label: "Card",
            },
          ]}
        />

        {/* Status */}

        <SelectField
          label="Status"
          name="status"
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
          options={[
            {
              value: "All",
              label: "All Statuses",
            },
            {
              value: "Paid",
              label: "Paid",
            },
            {
              value: "Pending",
              label: "Pending",
            },
            {
              value: "Cancelled",
              label: "Cancelled",
            },
          ]}
        />

        {/* Reset */}

        <div>
          <Button
            variant="secondary"
            onClick={onReset}
          >
            Reset Filters
          </Button>
        </div>

      </div>

      <div className="mt-4 text-sm text-gray-500">
        Showing{" "}
        <span className="font-semibold text-gray-800">
          {total}
        </span>{" "}
        payment(s)
      </div>

    </div>
  );
}

export default PaymentFilter;