import Badge from "../common/Badge";
import Button from "../common/Button";

function TrainerProfile({ trainer, onClose }) {
  if (!trainer) return null;

  return (
    <div className="space-y-6">

      <div className="flex flex-col items-center">

        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-5xl">
          👨‍🏫
        </div>

        <h2 className="text-2xl font-bold mt-4">
          {trainer.name}
        </h2>

        <p className="text-gray-500">
          {trainer.specialization}
        </p>

      </div>

      <div className="grid grid-cols-2 gap-5">

        <div>
          <p className="text-gray-500">Gender</p>
          <p className="font-semibold">
            {trainer.gender}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Phone</p>
          <p className="font-semibold">
            {trainer.phone}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Email</p>
          <p className="font-semibold">
            {trainer.email}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Experience</p>
          <p className="font-semibold">
            {trainer.experience} Years
          </p>
        </div>

        <div>
          <p className="text-gray-500">Salary</p>
          <p className="font-semibold">
            ETB {Number(trainer.salary).toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Hire Date</p>
          <p className="font-semibold">
            {trainer.hireDate}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Status</p>

          <Badge
            variant={
              trainer.status === "Active"
                ? "success"
                : "danger"
            }
          >
            {trainer.status}
          </Badge>
        </div>

      </div>

      <div className="flex justify-end">

        <Button
          variant="secondary"
          onClick={onClose}
        >
          Close
        </Button>

      </div>

    </div>
  );
}

export default TrainerProfile;