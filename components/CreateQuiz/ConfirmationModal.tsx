import { useEffect, useRef } from "react";

interface ConfirmationModalProps {
  message: string;
  visible: boolean;
  onClose?: () => void;
  onConfirm: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
  modalType?: "confirmation" | "warning" | "information";
}

function ConfirmationModal({
  message,
  visible,
  onClose,
  onConfirm,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  modalType = "confirmation",
}: ConfirmationModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      visible ? modalRef.current.showModal() : modalRef.current.close();
    }
  }, [visible]);

  //   const getModalStyle = () => {
  //     switch (modalType) {
  //       case "warning":
  //         return "modal-warning";
  //       case "information":
  //         return "modal-info";
  //       default:
  //         return "";
  //     }
  //   };

  return (
    // <dialog ref={modalRef} className={`modal ${getModalStyle()}`}>
    <dialog ref={modalRef} className={"modal"}>
      <form
        method="dialog"
        className="modal-box"
        onSubmit={(e) => e.preventDefault()}
      >
        <h3 className="text-lg font-bold">
          {modalType === "warning" ? "Warning" : "Confirmation"}
        </h3>
        <p>{message}</p>
        <div className="modal-action">
          {modalType !== "information" && (
            <button className="btn" onClick={onClose}>
              {cancelButtonText}
            </button>
          )}
          <button className="btn btn-primary" onClick={onConfirm}>
            {confirmButtonText}
          </button>
        </div>
      </form>
    </dialog>
  );
}

export default ConfirmationModal;
