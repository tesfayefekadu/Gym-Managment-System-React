import Table from "../common/Table";
import TrainerRow from "./TrainerRow";

function TrainerTable({
  trainers,
  onView,
  onEdit,
  onDelete,
}) {
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Trainer Name" },
    {
      key: "specialization",
      label: "Specialization",
    },
    {
      key: "experience",
      label: "Experience",
    },
    {
      key: "phone",
      label: "Phone",
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
      data={trainers}
      renderRow={(trainer) => (
        <TrainerRow
          key={trainer.id}
          trainer={trainer}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    />
  );
}

export default TrainerTable;