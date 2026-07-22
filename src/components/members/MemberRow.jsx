import Badge from "../common/Badge";

function MemberRow({ member, onEdit, onDelete }) {
  return (
    <tr className="border-b hover:bg-gray-50">

      <td className="px-6 py-4">
        {member.id}
      </td>

      <td className="px-6 py-4 font-medium">
        {member.name}
      </td>

      <td className="px-6 py-4">
        {member.plan}
      </td>

      <td className="px-6 py-4">
        {member.phone}
      </td>

      <td className="px-6 py-4">
        <Badge status={member.status} />
      </td>

      <td className="px-6 py-4 space-x-2">

        <button
          onClick={() => onEdit(member)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(member)}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
        >
          Delete
        </button>

      </td>

    </tr>
  );
}

export default MemberRow;