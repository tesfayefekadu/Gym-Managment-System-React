import Button from "./Button";

function Modal({
  title,
  children,
  isOpen,
  onClose,
  size = "lg",
}) {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div
        className={`
          bg-white
          rounded-xl
          shadow-xl
          w-full
          ${sizes[size]}
          animate-fadeIn
        `}
      >

        {/* Header */}

        <div className="flex justify-between items-center border-b px-6 py-4">

          <h2 className="text-2xl font-bold">
            {title}
          </h2>

          <Button
            variant="outline"
            onClick={onClose}
          >
            ✕
          </Button>

        </div>

        {/* Body */}

        <div className="p-6">

          {children}

        </div>

      </div>

    </div>
  );
}

export default Modal;