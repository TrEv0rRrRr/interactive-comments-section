import { useEffect, useRef } from "react";
import { useComments } from "../hooks/useComments";
import useModal from "../hooks/useModal";

type Props = {
  id: number | null;
};

const Modal = ({ id }: Props) => {
  const { closeModal, isOpen } = useModal();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { removeComment } = useComments();

  useEffect(() => {
    if (isOpen) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [isOpen]);

  const openOpacityStyle = isOpen
    ? "opacity-100 pointer-events-auto"
    : "opacity-0 pointer-events-none";

  const handleDelete = async () => {
    await removeComment(Number(id));
    closeModal();
  };

  return (
    <dialog
      className={`flex flex-col bg-white gap-3 w-[21rem] z-10 py-5 px-7 rounded-md transition-opacity ${openOpacityStyle} fixed left-5 top-0 translate-y-1/2`}
      ref={dialogRef}
      onClose={closeModal}
    >
      <h2 className="text-[1.3rem] font-medium">Delete comment</h2>

      <p className="text-Grayish-Blue">
        Are you sure you want to delete this comment? This will remove the
        comment and can't be undone.
      </p>

      <div className="flex gap-4">
        <button
          className="bg-Grayish-Blue text-white font-medium rounded-md px-4 py-3 cursor-pointer hover:bg-Grayish-Blue/50 transition-all"
          onClick={closeModal}
        >
          NO, CANCEL
        </button>
        <button
          className="bg-Soft-Red text-white font-medium 
        rounded-md px-4 py-3 cursor-pointer hover:bg-Soft-Red/50 transition-all"
          onClick={handleDelete}
        >
          YES, DELETE
        </button>
      </div>
    </dialog>
  );
};

export default Modal;
