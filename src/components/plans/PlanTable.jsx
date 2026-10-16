import Table from "../common/Table";
import PlanRow from "./PlanRow";

function PlanTable({
  plans,
  onView,
  onEdit,
  onDelete,
  canManagePlans = true,
}) {
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Plan Name" },
    { key: "duration", label: "Duration" },
    { key: "price", label: "Price" },
    { key: "members", label: "Members" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
  ];

  return (
    <Table
      columns={columns}
      data={plans}
      renderRow={(plan) => (
        <PlanRow
          key={plan.id}
          plan={plan}
          onView={onView}
          onEdit={canManagePlans ? onEdit : undefined}
          onDelete={canManagePlans ? onDelete : undefined}
        />
      )}
    />
  );
}

export default PlanTable;