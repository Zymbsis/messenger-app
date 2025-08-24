import type { FormEvent } from 'react';
import { IoIosSend } from 'react-icons/io';

import { useSendMessageMutation } from '../redux/api/apiSlice';

type Props = { chatId: number };

const SendMessageForm = ({ chatId }: Props) => {
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const content = (form.elements.namedItem('message') as HTMLTextAreaElement)
      .value;

    if (!content.trim() || !chatId) return;

    try {
      await sendMessage({ content, chatId }).unwrap();
      form.reset();
    } catch (error) {
      console.error('Failed to send the message: ', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='h-1/6 border mr-4 rounded-lg relative'>
      <textarea
        disabled={isSending}
        className='w-full h-full p-2'
        name='message'></textarea>
      <button
        disabled={isSending}
        className='absolute bottom-0 right-0 size-12 p-2'>
        <IoIosSend className='w-full h-full' />
      </button>
    </form>
  );
};

export default SendMessageForm;
