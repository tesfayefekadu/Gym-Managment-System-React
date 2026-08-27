import Badge from "../common/Badge";
import Button from "../common/Button";

function PaymentRow({
  payment,
  onEdit,
  onDelete,
}) {
  return (
    <tr className="border-b hover:bg-gray-50">

      {/* ID */}

      <td className="px-6 py-4">
        {payment.id}
      </td>

      {/* Member */}

      <td className="px-6 py-4">

        <div className="font-medium text-gray-800">
          {payment.memberName}
        </div>

        <div className="text-xs text-gray-400">
          Member #{payment.memberId}
        </div>

      </td>

      {/* Plan */}

      <td className="px-6 py-4">
        {payment.plan}
      </td>

      {/* Amount */}

      <td className="px-6 py-4 font-medium">
        {Number(
          payment.amount
        ).toLocaleString()}{" "}
        ETB
      </td>

      {/* Date */}

      <td className="px-6 py-4">
        {payment.paymentDate}
      </td>

      {/* Method */}

      <td className="px-6 py-4">
        {payment.method}
      </td>

      {/* Status */}

      <td className="px-6 py-4">

        <Badge
          variant={
            payment.status === "Paid"
              ? "success"
              : payment.status === "Pending"
              ? "warning"
              : "danger"
          }
        >
          {payment.status}
        </Badge>

      </td>

      {/* Actions */}

      <td className="px-6 py-4">

        <div className="flex justify-center gap-2">

          <Button
            variant="warning"
            onClick={() =>
              onEdit(payment)
            }
          >
            Edit
          </Button>

          <Button
            variant="danger"
            onClick={() =>
              onDelete(payment.id)
            }
          >
            Delete
          </Button>

        </div>

      </td>

    </tr>
  );
}

export default PaymentRow;