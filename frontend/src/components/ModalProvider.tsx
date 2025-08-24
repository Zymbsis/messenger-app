import {
  useRef,
  useState,
  type PropsWithChildren,
  type MouseEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { ModalContext } from '../helpers/modalContext';
import type { DialogData } from '../types/types';
import ConfirmDialog from './ConfirmDialog';

type Props = PropsWithChildren;

const ModalProvider = ({ children }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [dialogData, setDialogData] = useState<DialogData | null>(null);

  const handleSetDialogData = (data: DialogData) => setDialogData(data);

  const handleCloseModal = () => {
    dialogRef.current?.close();
    dialogData?.onCancel?.();
    setDialogData(null);
  };

  const onBackdropClick = ({
    target,
    currentTarget,
  }: MouseEvent<HTMLDialogElement>) => {
    if (target === currentTarget) handleCloseModal();
  };

  if (dialogData) dialogRef.current?.showModal();

  return (
    <ModalContext value={{ handleSetDialogData }}>
      {children}
      {createPortal(
        <dialog
          ref={dialogRef}
          className='max-w-[90vw] md:max-w-[45vw] 2xl:max-w-[35vw] relative rounded-lg'
          onClick={onBackdropClick}
          onClose={handleCloseModal}>
          {dialogData && (
            <ConfirmDialog
              title={dialogData.title}
              description={dialogData.description}
              onConfirm={() => {
                dialogData.onConfirm();
                handleCloseModal();
              }}
              onCancel={handleCloseModal}
            />
          )}
        </dialog>,
        document.getElementById('modal')!,
      )}
    </ModalContext>
  );
};

export default ModalProvider;
