import Badge from "../common/Badge";
import Button from "../common/Button";

function MemberRow({
  member,
  onEdit,
  onDelete,
}) {
  return (
    <tr className="border-b hover:bg-gray-50">

      {/* ID */}
      <td className="px-6 py-4">
        {member.id}
      </td>

      {/* Name */}
      <td className="px-6 py-4 font-medium">
        {member.name}
      </td>

      {/* Plan */}
      <td className="px-6 py-4">
        {member.membership_plan ||
          "No Plan"}
      </td>

      {/* Phone */}
      <td className="px-6 py-4">
        {member.phone || "-"}
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <Badge
          variant={
            member.status === "Active"
              ? "success"
              : "danger"
          }
        >
          {member.status || "Unknown"}
        </Badge>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex justify-center gap-2">

          <Button
            variant="primary"
            onClick={() => onEdit(member)}
          >
            Edit
          </Button>

          <Button
            variant="danger"
            onClick={() =>
              onDelete(member)
            }
          >
            Delete
          </Button>

        </div>
      </td>

    </tr>
  );
}

export default MemberRow;