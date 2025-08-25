import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { IoIosSend } from 'react-icons/io';
import { GiPaperClip } from 'react-icons/gi';
import { MdDeleteOutline } from 'react-icons/md';

import { useSendMessageMutation } from '../redux/api/apiSlice';
import { CloudinaryService } from '../services/cloudinaryService';

import { isNotEmpty } from '../helpers/validation';

type Props = { chatId: number };

const SendMessageForm = ({ chatId }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const content = (form.elements.namedItem('message') as HTMLTextAreaElement)
      .value;

    if (!isNotEmpty(content) && !files.length) return;

    try {
      const attachments = await CloudinaryService.upload(files);

      await sendMessage({
        content: content || '',
        chatId,
        attachments,
      }).unwrap();

      form.reset();
      setFiles([]);

      if (fileInputRef.current) fileInputRef.current.value = '';

      const timeout = setTimeout(() => {
        (form.elements.namedItem('message') as HTMLTextAreaElement).focus();
        clearTimeout(timeout);
      }, 25);
    } catch (error) {
      console.error('Failed to send the message: ', error);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  const handlePaperclipClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleSelectFiles = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (!target.files) return;
    const files = Array.from(target.files);
    setFiles((prev) => [...prev, ...files]);
  };

  return (
    <>
      {!!files.length && (
        <div className='p-2 bg-black/40 rounded-lg mr-4'>
          <p className='text-sm text-black/70 mb-1'>
            {files.length} file(s) selected:
          </p>
          <div className='flex flex-wrap gap-1'>
            {files.map((file, index) => (
              <span className='flex items-center gap-1 bg-gray-900 rounded px-1 py-1'>
                <span
                  key={`${file.name}-${index}`}
                  className='text-xs text-white/80'>
                  {file.name}
                </span>
                <button
                  title='Remove file'
                  className='size-4 text-white/80'
                  type='button'
                  onClick={() =>
                    setFiles((prev) =>
                      prev.filter(({ name }) => name !== file.name),
                    )
                  }>
                  <MdDeleteOutline />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
      <div className='h-1/6 mr-4'>
        <form
          onSubmit={handleSubmit}
          className='h-full border rounded-lg relative'>
          <textarea
            disabled={isSending}
            className='w-11/12 p-3 h-full no-scrollbar'
            onKeyDown={handleKeyDown}
            name='message'
            placeholder={
              files.length > 0 ? 'Add a caption...' : 'Type a message...'
            }></textarea>
          <button
            title='Ctrl / Cmd + Enter to send'
            disabled={isSending}
            className='absolute bottom-0 right-0 size-12 p-2'>
            <IoIosSend />
          </button>
          <button
            className='absolute top-3 right-3'
            type='button'
            onClick={handlePaperclipClick}>
            <GiPaperClip size={24} strokeWidth={2} />
          </button>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*, video/*, audio/*'
            className='hidden size-0 absolute top-3 right-3 -z-50'
            onChange={handleSelectFiles}
            multiple
            hidden
          />
        </form>
      </div>
    </>
  );
};

export default SendMessageForm;
