import Button from "../common/Button";

function AttendanceHeader({
  onCheckIn,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Attendance
        </h1>

        <p className="text-gray-500 mt-1">
          Manage member check-ins and attendance records
        </p>
      </div>

      <div>
        <Button
          variant="primary"
          onClick={onCheckIn}
        >
          Check In
        </Button>
      </div>

    </div>
  );
}

export default AttendanceHeader;