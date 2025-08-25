import { createContext, use } from 'react';
import type { AttachmentMetadata, DialogData } from '../types/types';

export const ModalContext = createContext<{
  handleSetDialogData: (data: DialogData) => void;
  handleSetImageData: (data: AttachmentMetadata) => void;
}>({
  handleSetDialogData: () => {},
  handleSetImageData: () => {},
});

export const useModalContext = () => use(ModalContext);
