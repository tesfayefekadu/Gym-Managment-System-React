function Table({
  columns = [],
  data = [],
  renderRow = () => null,
}) {

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">

      <table className="min-w-full">

        <thead className="bg-gray-100">

          <tr>

            {columns.map((column) => (

              <th
                key={column.key}
                className="px-6 py-4 text-left font-semibold"
              >
                {column.label}
              </th>

            ))}

          </tr>

        </thead>


        <tbody>

          {data.length > 0 ? (

            data.map(renderRow)

          ) : (

            <tr>

              <td
                colSpan={columns.length}
                className="text-center py-10 text-gray-500"
              >
                No data found.
              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>
  );
}

export default Table;