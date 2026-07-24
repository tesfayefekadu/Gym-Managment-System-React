function TrainerModal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-red-600"
          >
            x
          </button>

        </div>

        {children}

      </div>

    </div>
  );
}

export default TrainerModal;