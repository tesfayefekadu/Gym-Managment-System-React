import Button from "../common/Button";
import InputField from "../common/InputField";
import SelectField from "../common/SelectField";

function TrainerFilter({
  search,
  setSearch,
  specialization,
  setSpecialization,
  status,
  setStatus,
  total,
  onReset,
}) {
  return (
    <div className="bg-white rounded-xl shadow p-5 mb-6">

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">

        <InputField
          label="Search"
          placeholder="Search trainer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <SelectField
          label="Specialization"
          value={specialization}
          onChange={(e) =>
            setSpecialization(e.target.value)
          }
          options={[
            {
              value: "All",
              label: "All Specializations",
            },
            {
              value: "Weight Training",
              label: "Weight Training",
            },
            {
              value: "Cardio",
              label: "Cardio",
            },
            {
              value: "Yoga",
              label: "Yoga",
            },
            {
              value: "CrossFit",
              label: "CrossFit",
            },
            {
              value: "Bodybuilding",
              label: "Bodybuilding",
            },
          ]}
        />

        <SelectField
          label="Status"
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
          options={[
            {
              value: "All",
              label: "All Status",
            },
            {
              value: "Active",
              label: "Active",
            },
            {
              value: "Inactive",
              label: "Inactive",
            },
          ]}
        />

        <div>
          <label className="font-medium text-gray-700">
            Total Trainers
          </label>

          <div className="h-11 flex items-center px-4 rounded-lg border border-gray-300 bg-gray-50 font-semibold">
            {total}
          </div>
        </div>

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

export default TrainerFilter;