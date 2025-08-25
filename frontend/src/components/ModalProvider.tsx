import {
  useRef,
  useState,
  type PropsWithChildren,
  type MouseEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { ModalContext } from '../helpers/modalContext';
import type { AttachmentMetadata, DialogData } from '../types/types';
import ConfirmDialog from './ConfirmDialog';
import ImageModal from './ImageModal';
import clsx from 'clsx';

type Props = PropsWithChildren;

const ModalProvider = ({ children }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [dialogData, setDialogData] = useState<DialogData | null>(null);
  const [imageData, setImageData] = useState<AttachmentMetadata | null>(null);

  const handleSetDialogData = (data: DialogData) => setDialogData(data);
  const handleSetImageData = (data: AttachmentMetadata) => setImageData(data);

  const handleCloseModal = () => {
    if (dialogData) setDialogData(null);
    if (imageData) setImageData(null);
    dialogRef.current?.close();
    dialogData?.onCancel?.();
  };

  const onBackdropClick = ({
    target,
    currentTarget,
  }: MouseEvent<HTMLDialogElement>) => {
    if (target === currentTarget) handleCloseModal();
  };

  if (dialogData || imageData) dialogRef.current?.showModal();

  return (
    <ModalContext value={{ handleSetDialogData, handleSetImageData }}>
      {children}
      {createPortal(
        <dialog
          ref={dialogRef}
          className={clsx(
            {
              'max-w-[90vw] md:max-w-[45vw] 2xl:max-w-[35vw] relative':
                dialogData,
            },
            {
              'bg-transparent ': imageData,
            },
            'backdrop:bg-black/50 rounded-lg',
          )}
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
          {imageData && <ImageModal image={imageData} />}
        </dialog>,
        document.getElementById('modal')!,
      )}
    </ModalContext>
  );
};

export default ModalProvider;
