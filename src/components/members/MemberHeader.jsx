function MemberHeader({ onAddMember }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Members
        </h1>

        <p className="text-gray-500 mt-1">
          Manage gym members and their memberships.
        </p>
      </div>

      <button
        onClick={onAddMember}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
      >
        + Add Member
      </button>
    </div>
  );
}

export default MemberHeader;