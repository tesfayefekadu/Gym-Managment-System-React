import Badge from "../common/Badge";
import Button from "../common/Button";

function TrainerRow({
  trainer,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <tr className="border-b hover:bg-gray-50">

      <td className="px-6 py-4">
        {trainer.id}
      </td>

      <td className="px-6 py-4 font-medium">
        {trainer.name}
      </td>

      <td className="px-6 py-4">
        {trainer.specialization}
      </td>

      <td className="px-6 py-4">
        {trainer.experience} Years
      </td>

      <td className="px-6 py-4">
        {trainer.phone}
      </td>

      <td className="px-6 py-4">
        <Badge
          variant={
            trainer.status === "Active"
              ? "success"
              : "danger"
          }
        >
          {trainer.status}
        </Badge>
      </td>

      <td className="px-6 py-4">

        <div className="flex gap-2 justify-center">

          <Button
            variant="primary"
            onClick={() => onView(trainer)}
          >
            View
          </Button>

          <Button
            variant="warning"
            onClick={() => onEdit(trainer)}
          >
            Edit
          </Button>

          <Button
            variant="danger"
            onClick={() => onDelete(trainer.id)}
          >
            Delete
          </Button>

        </div>

      </td>

    </tr>
  );
}

export default TrainerRow;