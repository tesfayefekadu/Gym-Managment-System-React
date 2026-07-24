function TrainerHeader({ onAddTrainer }) {
  return (
    <div className="flex justify-between items-center mb-6">

      <div>
        <h1 className="text-3xl font-bold">
          Trainer Management
        </h1>

        <p className="text-gray-500">
          Manage gym trainers.
        </p>
      </div>

      <button
        onClick={onAddTrainer}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
      >
        + Add Trainer
      </button>

    </div>
  );
}

export default TrainerHeader;