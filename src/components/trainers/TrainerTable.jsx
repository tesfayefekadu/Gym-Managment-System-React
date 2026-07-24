import TrainerRow from "./TrainerRow";

function TrainerTable({ trainers }) {

  return (

    <div className="bg-white rounded-xl shadow overflow-hidden">

      <table className="w-full">

        <thead className="bg-gray-100">

          <tr>

            <th className="px-6 py-4 text-left">ID</th>

            <th className="px-6 py-4 text-left">Name</th>

            <th className="px-6 py-4 text-left">
              Specialization
            </th>

            <th className="px-6 py-4 text-left">
              Experience
            </th>

            <th className="px-6 py-4 text-left">
              Phone
            </th>

            <th className="px-6 py-4 text-left">
              Status
            </th>

            <th className="px-6 py-4 text-center">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {trainers.map((trainer) => (

            <TrainerRow
              key={trainer.id}
              trainer={trainer}
            />

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default TrainerTable;