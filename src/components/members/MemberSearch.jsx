function MemberSearch({ searchTerm, onSearch }) {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search by name or phone..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full md:w-96 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default MemberSearch;