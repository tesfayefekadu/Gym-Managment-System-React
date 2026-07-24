function TrainerRow({ trainer }) {

  return (

    <tr className="border-b hover:bg-gray-50">

      <td className="px-6 py-4">
        {trainer.id}
      </td>

      <td className="px-6 py-4 font-medium">
        {trainer.name}
      </td>

      <td className="px-6 py-4">
        {trainer.specialization}
      </td>

      <td className="px-6 py-4">
        {trainer.experience} Years
      </td>

      <td className="px-6 py-4">
        {trainer.phone}
      </td>

      <td className="px-6 py-4">

        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            trainer.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {trainer.status}
        </span>

      </td>

      <td className="px-6 py-4">

        <div className="flex justify-center gap-2">

          <button
            className="
            bg-yellow-500
            hover:bg-yellow-600
            text-white
            px-3
            py-1
            rounded
            "
          >
            Edit
          </button>

          <button
            className="
            bg-red-600
            hover:bg-red-700
            text-white
            px-3
            py-1
            rounded
            "
          >
            Delete
          </button>

        </div>

      </td>

    </tr>

  );

}

export default TrainerRow;