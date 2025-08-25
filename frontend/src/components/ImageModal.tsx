import { IoMdClose } from 'react-icons/io';
import type { AttachmentMetadata } from '../types/types';

type Props = { image: AttachmentMetadata };

const ImageModal = ({ image }: Props) => {
  return (
    <form method='dialog' className='relative flex justify-center rounded-lg'>
      <img
        src={image.full_image_url}
        alt={image.file_name}
        className='object-contain w-full h-auto max-h-[90vh] max-w-[80vw]'
      />

      <button
        className='size-8 p-1.5 absolute top-3 right-3 rounded-lg bg-black/80 text-white'
        title='Close'>
        <IoMdClose />
      </button>
    </form>
  );
};

export default ImageModal;
