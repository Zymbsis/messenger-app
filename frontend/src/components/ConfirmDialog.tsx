import { IoMdClose } from 'react-icons/io';
import clsx from 'clsx';

type Props = {
  title: string;
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

const buttonStyles =
  'w-34 h-12 rounded-lg flex justify-center items-center text-xl font-medium border border-black';

const ConfirmDialog = ({ title, description, onCancel, onConfirm }: Props) => {
  return (
    <>
      <form className='absolute top-0 right-0' method='dialog'>
        <button className='size-10 p-2' title='Close'>
          <IoMdClose />
        </button>
      </form>
      <div className='flex items-center flex-col h-full px-6 py-8 gap-6'>
        <p className='text-[26px] font-medium'>{title}</p>
        {description && <p className='text-center'>{description}</p>}
        <div className='flex gap-8'>
          <button
            onClick={onCancel}
            className={clsx(buttonStyles, 'bg-white text-black/90')}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={clsx(buttonStyles, 'bg-black/90 text-white')}>
            Confirm
          </button>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog;
