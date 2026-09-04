import Badge from "../common/Badge";
import Button from "../common/Button";

function PlanRow({
  plan,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <tr className="border-b hover:bg-gray-50 transition">

      {/* ID */}
      <td className="px-6 py-4">
        {plan.id}
      </td>

      {/* Plan Name */}
      <td className="px-6 py-4 font-semibold text-gray-800">
        {plan.name}
      </td>

      {/* Duration */}
      <td className="px-6 py-4">
        {plan.duration_months}
      </td>

      {/* Price */}
      <td className="px-6 py-4 font-medium">
        {Number(plan.price).toLocaleString()} ETB
      </td>

      {/* Members */}
      <td className="px-6 py-4">
        {plan.members}
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <Badge
          variant={
            plan.status === "Active"
              ? "success"
              : "danger"
          }
        >
          {plan.status}
        </Badge>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex justify-center gap-2">

          <Button
            variant="primary"
            onClick={() => onView(plan)}
          >
            View
          </Button>

          <Button
            variant="warning"
            onClick={() => onEdit(plan)}
          >
            Edit
          </Button>

          <Button
            variant="danger"
            onClick={() => onDelete(plan.id)}
          >
            Delete
          </Button>

        </div>
      </td>

    </tr>
  );
}

export default PlanRow;