function MemberSearch() {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search members..."
        className="w-full md:w-80 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default MemberSearch;