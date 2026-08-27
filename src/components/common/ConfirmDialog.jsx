import Modal from "./Modal";
import Button from "./Button";

function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onCancel}
      size="sm"
    >
      <div className="space-y-6">

        <p className="text-gray-600">
          {message}
        </p>

        <div className="flex justify-end gap-3">

          <Button
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
          >
            Delete
          </Button>

        </div>

      </div>
    </Modal>
  );
}

export default ConfirmDialog;