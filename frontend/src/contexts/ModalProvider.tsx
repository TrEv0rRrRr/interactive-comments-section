import { ReactNode, useState } from "react";
import { ModalContext } from "./ModalContext";
type ModalProviderProps = {
  children: ReactNode;
};

export default function ModalProvider({ children }: ModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Opens the modal by setting the `isOpen` state to `true`.
   */
  const openModal = () => setIsOpen(true);

  /**
   * Closes the modal.
   *
   * This function sets the modal state to closed by updating `setIsOpen` to `false`.
   */
  const closeModal = () => setIsOpen(false);

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}
