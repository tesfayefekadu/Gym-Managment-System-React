import Button from "../common/Button";

function TrainerHeader({ onAddTrainer }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">
          Trainer Management
        </h1>

        <p className="text-gray-500">
          Manage all gym trainers
        </p>
      </div>

      <Button
        variant="primary"
        onClick={onAddTrainer}
      >
        + Add Trainer
      </Button>
    </div>
  );
}

export default TrainerHeader;