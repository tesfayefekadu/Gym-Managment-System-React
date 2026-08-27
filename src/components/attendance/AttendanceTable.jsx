import Table from "../common/Table";
import AttendanceRow from "./AttendanceRow";

function AttendanceTable({
  attendance,
  onCheckOut,
}) {
  const columns = [
    {
      key: "id",
      label: "ID",
    },
    {
      key: "memberName",
      label: "Member",
    },
    {
      key: "date",
      label: "Date",
    },
    {
      key: "checkIn",
      label: "Check In",
    },
    {
      key: "checkOut",
      label: "Check Out",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "action",
      label: "Action",
    },
  ];

  return (
    <Table
      columns={columns}
      data={attendance}
      renderRow={(record) => (
        <AttendanceRow
          key={record.id}
          attendance={record}
          onCheckOut={onCheckOut}
        />
      )}
    />
  );
}

export default AttendanceTable;