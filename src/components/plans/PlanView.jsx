import Badge from "../common/Badge";
import Button from "../common/Button";

function PlanView({ plan, onClose }) {
  if (!plan) {
    return null;
  }

  return (
    <div className="space-y-6">

      {/* Plan Header */}

      <div className="flex items-center justify-between border-b pb-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {plan.name}
          </h2>

          <p className="text-gray-500 mt-1">
            Membership Plan Details
          </p>
        </div>

        <Badge
          variant={
            plan.status === "Active"
              ? "success"
              : "danger"
          }
        >
          {plan.status}
        </Badge>
      </div>

      {/* Plan Information */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Duration */}

        <div className="bg-gray-50 rounded-lg p-5">
          <p className="text-sm text-gray-500">
            Duration
          </p>

          <p className="text-lg font-semibold text-gray-800 mt-1">
            {plan.duration}
          </p>
        </div>

        {/* Price */}

        <div className="bg-gray-50 rounded-lg p-5">
          <p className="text-sm text-gray-500">
            Price
          </p>

          <p className="text-lg font-semibold text-gray-800 mt-1">
            {Number(plan.price).toLocaleString()} ETB
          </p>
        </div>

        {/* Members */}

        <div className="bg-gray-50 rounded-lg p-5">
          <p className="text-sm text-gray-500">
            Members
          </p>

          <p className="text-lg font-semibold text-gray-800 mt-1">
            {plan.members}
          </p>
        </div>

        {/* Plan ID */}

        <div className="bg-gray-50 rounded-lg p-5">
          <p className="text-sm text-gray-500">
            Plan ID
          </p>

          <p className="text-lg font-semibold text-gray-800 mt-1">
            #{plan.id}
          </p>
        </div>
      </div>

      {/* Description */}

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Description
        </h3>

        <div className="bg-gray-50 rounded-lg p-5">
          <p className="text-gray-600 leading-relaxed">
            {plan.description || "No description available."}
          </p>
        </div>
      </div>

      {/* Footer */}

      <div className="flex justify-end pt-3 border-t">
        <Button
          type="button"
          variant="primary"
          onClick={onClose}
        >
          Close
        </Button>
      </div>

    </div>
  );
}

export default PlanView;