import { useContext } from "react";
import { ModalContext, ModalContextType } from "../contexts/ModalContext";

/**
 * Custom hook to access the modal context.
 *
 * This hook provides access to the modal context, which should be used
 * within a `ModalProvider`. If the hook is used outside of a `ModalProvider`,
 * it will throw an error.
 *
 * @returns {ModalContextType} The modal context value.
 * @throws {Error} If the hook is used outside of a `ModalProvider`.
 */
export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within a ModalProvider");
  return context;
};

export default useModal;
