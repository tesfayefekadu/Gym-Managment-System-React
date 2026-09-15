import Badge from "../common/Badge";
import Button from "../common/Button";

function PaymentRow({
  payment,
  onEdit,
  onDelete,
}) {
  const getStatusVariant = (status) => {
    switch (status) {
      case "Completed":
        return "success";

      case "Pending":
        return "warning";

      case "Failed":
        return "danger";

      case "Refunded":
        return "warning";

      default:
        return "danger";
    }
  };

  return (
    <tr className="border-b hover:bg-gray-50">

      {/* ID */}

      <td className="px-6 py-4">
        {payment.id}
      </td>

      {/* Member */}

      <td className="px-6 py-4">

        <div className="font-medium text-gray-800">
          {payment.memberName || "Unknown Member"}
        </div>

        <div className="text-xs text-gray-400">
          Member #{payment.memberId}
        </div>

      </td>

      {/* Plan */}

      <td className="px-6 py-4">
        {payment.plan || "N/A"}
      </td>

      {/* Amount */}

      <td className="px-6 py-4 font-medium">
        {Number(payment.amount || 0).toLocaleString()} ETB
      </td>

      {/* Date */}

      <td className="px-6 py-4">
        {payment.paymentDate || "N/A"}
      </td>

      {/* Method */}

      <td className="px-6 py-4">
        {payment.method || "N/A"}
      </td>

      {/* Status */}

      <td className="px-6 py-4">

        <Badge variant={getStatusVariant(payment.status)}>
          {payment.status || "Unknown"}
        </Badge>

      </td>

      {/* Actions */}

      <td className="px-6 py-4">

        <div className="flex justify-center gap-2">

          <Button
            variant="warning"
            onClick={() => onEdit(payment)}
          >
            Edit
          </Button>

          <Button
            variant="danger"
            onClick={() => onDelete(payment.id)}
          >
            Delete
          </Button>

        </div>

      </td>

    </tr>
  );
}

export default PaymentRow;