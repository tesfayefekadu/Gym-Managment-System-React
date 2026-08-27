import Button from "../common/Button";

function PaymentHeader({ onAddPayment }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Payments
        </h1>

        <p className="text-gray-500 mt-1">
          Manage gym member payments and transactions
        </p>
      </div>

      <Button
        variant="primary"
        onClick={onAddPayment}
      >
        + Add Payment
      </Button>

    </div>
  );
}

export default PaymentHeader;