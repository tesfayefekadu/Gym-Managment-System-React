import Badge from "../common/Badge";
import Button from "../common/Button";

function AttendanceRow({
  attendance,
  onCheckOut,
}) {
  const getStatusVariant = () => {
    if (attendance.status === "Present") {
      return "success";
    }

    if (attendance.status === "Late") {
      return "warning";
    }

    if (attendance.status === "Absent") {
      return "danger";
    }

    return "secondary";
  };

  const handleCheckOut = () => {
    onCheckOut(attendance.id);
  };

  return (
    <tr className="border-b hover:bg-gray-50">

      {/* ID */}

      <td className="px-6 py-4">
        {attendance.id}
      </td>

      {/* Member */}

      <td className="px-6 py-4 font-medium">
        {attendance.memberName}
      </td>

      {/* Date */}

      <td className="px-6 py-4">
        {attendance.date}
      </td>

      {/* Check In */}

      <td className="px-6 py-4">
        {attendance.checkIn || "-"}
      </td>

      {/* Check Out */}

      <td className="px-6 py-4">
        {attendance.checkOut || "-"}
      </td>

      {/* Status */}

      <td className="px-6 py-4">
        <Badge
          variant={getStatusVariant()}
        >
          {attendance.status}
        </Badge>
      </td>

      {/* Actions */}

      <td className="px-6 py-4">
        <div className="flex gap-2">

          {!attendance.checkOut &&
            attendance.checkIn && (
              <Button
                variant="primary"
                onClick={handleCheckOut}
              >
                Check Out
              </Button>
            )}

          {attendance.checkOut && (
            <span className="text-sm text-gray-500 flex items-center">
              Completed
            </span>
          )}

        </div>
      </td>

    </tr>
  );
}

export default AttendanceRow;