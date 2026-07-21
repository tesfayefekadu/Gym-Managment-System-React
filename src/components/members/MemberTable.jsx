import MemberRow from "./MemberRow";

function MemberTable({ members }) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">

      <table className="w-full text-left">

        <thead className="bg-gray-100">

          <tr>

            <th className="px-6 py-4">ID</th>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Plan</th>
            <th className="px-6 py-4">Phone</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Action</th>

          </tr>

        </thead>

        <tbody>

          {members.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
            />
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default MemberTable;