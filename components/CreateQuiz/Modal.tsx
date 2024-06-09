import { useRef, useEffect } from "react";

interface ModalProps {
  title: string;
  child: any;
  visible: boolean;
  onClose: () => void;
}

function Modal({ title, child, visible, onClose }: ModalProps) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!modalRef.current) {
      return;
    }
    visible ? modalRef.current.showModal() : modalRef.current.close();
  }, [visible]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleESC = (event) => {
    event.preventDefault();
    handleClose();
  };

  return (
    <dialog
      ref={modalRef}
      id="my_modal_1"
      className="modal"
      onCancel={handleESC}
    >
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4">{child}</p>
        <div className="modal-action">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn" onClick={handleClose}>
            Close
          </button>
        </div>
      </form>
    </dialog>
  );
}
export default Modal;
