import AriaModal from "react-aria-modal";
import { Card } from "./Card";
import { v4 as uuidv4 } from "uuid";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const MyModal = ({ isOpen, closeModal }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <AriaModal onExit={closeModal} titleText="Create new note">
      <div className="relative bg-gray-800 p-6 rounded shadow-lg max-w-sm mx-auto">
        <h2 className="text-lg font-bold">Add new note</h2>
        <Card
          id={uuidv4()}
          title={""}
          body={""}
          isCreate
          handleModalClose={closeModal}
        />
        <div>
          <button
            onClick={closeModal}
            className="absolute top-[5px] right-[5px] mt-4 text-white px-3 py-1"
          >
            X
          </button>
        </div>
      </div>
    </AriaModal>
  );
};

export default MyModal;
