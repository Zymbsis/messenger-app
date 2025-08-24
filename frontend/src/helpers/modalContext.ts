import { createContext, use } from 'react';
import type { DialogData } from '../types/types';

export const ModalContext = createContext<{
  handleSetDialogData: (data: DialogData) => void;
}>({
  handleSetDialogData: () => {},
});

export const useModalContext = () => use(ModalContext);
