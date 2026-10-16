
import Badge from "../common/Badge";
import Button from "../common/Button";

function PlanRow({
  plan,
  onView,
  onEdit,
  onDelete,
}) {
  const canManagePlans =
    typeof onEdit === "function" &&
    typeof onDelete === "function";

  return (
    <tr className="border-b hover:bg-gray-50 transition">
      <td className="px-6 py-4">
        {plan.id}
      </td>

      <td className="px-6 py-4 font-semibold text-gray-800">
        {plan.name}
      </td>

      <td className="px-6 py-4">
        {plan.duration_months} months
      </td>

      <td className="px-6 py-4 font-medium">
        {Number(plan.price).toLocaleString()} ETB
      </td>

      <td className="px-6 py-4">
        {plan.members ?? 0}
      </td>

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

      <td className="px-6 py-4">
        <div className="flex justify-center gap-2">
          <Button
            variant="primary"
            onClick={() => onView(plan)}
          >
            View
          </Button>

          {canManagePlans && (
            <>
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
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

export default PlanRow;