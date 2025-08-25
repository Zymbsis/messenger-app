import { useEffect, useRef, useState, type FocusEvent } from 'react';
import clsx from 'clsx';
import { MdDeleteOutline, MdModeEditOutline } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import { FaRegCheckCircle } from 'react-icons/fa';
import { BiCheck, BiCheckDouble } from 'react-icons/bi';
import { useInView } from 'motion/react';

import {
  useDeleteMessageMutation,
  useEditMessageMutation,
} from '../redux/api/apiSlice';
import { useAppSelector } from '../redux/hooks';
import { selectCurrentUser } from '../redux/users/selectors';

import { WebSocketService } from '../services/websocketService';

import { CONFIRM_MESSAGES } from '../helpers/confirmMessages';
import { formattedDateTimeEn } from '../helpers/formatting';
import { isNotEmpty } from '../helpers/validation';
import { useModalContext } from '../helpers/modalContext';

import type { Message } from '../types/types';

type Props = {
  message: Message;
  isOwnMessage: boolean;
};

const ChatMessage = ({ message, isOwnMessage }: Props) => {
  const messageRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const saveButtonRef = useRef<HTMLButtonElement | null>(null);
  const { handleSetDialogData } = useModalContext();
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [deleteMessage] = useDeleteMessageMutation();
  const [editMessage] = useEditMessageMutation();

  const user = useAppSelector(selectCurrentUser);
  const isInView = useInView(messageRef, { once: true });

  const createdAt = new Date(message.created_at);
  const updatedAt = new Date(message.updated_at);
  const isMessageEdited = +createdAt !== +updatedAt;

  const handleStartEditing = () => {
    setEditedContent(message.content);
    setEditMode(true);
    inputRef.current?.focus();
  };

  const handleFinishEditing = () => {
    if (isNotEmpty(editedContent) && editedContent !== message.content) {
      editMessage({
        content: editedContent,
        id: message.id,
      });
      setEditMode(false);
    } else {
      handleCancelEditing();
    }
  };

  const handleCancelEditing = () => {
    setEditedContent('');
    setEditMode(false);
  };

  const handleBlur = ({ relatedTarget }: FocusEvent<HTMLInputElement>) => {
    if (relatedTarget !== saveButtonRef.current) handleCancelEditing();
  };

  const handleKeyDown = ({ key }: React.KeyboardEvent<HTMLInputElement>) => {
    if (key === 'Enter') {
      handleFinishEditing();
    } else if (key === 'Escape') {
      handleCancelEditing();
    }
  };

  const handleDeleteBtnClick = () => {
    handleSetDialogData({
      title: CONFIRM_MESSAGES.deleteMessage.title,
      description: CONFIRM_MESSAGES.deleteMessage.description,
      onConfirm: () => deleteMessage(message.id),
    });
  };

  useEffect(() => {
    if (isInView && !message.is_read && message.sender_id !== user?.id) {
      WebSocketService.send('message_read', {
        id: message.id,
        chat_id: message.chat_id,
      });
    }
  }, [
    isInView,
    message.id,
    message.chat_id,
    message.sender_id,
    message.is_read,
    user?.id,
  ]);

  return (
    <div ref={messageRef} className='relative group/message'>
      {message.content && (
        <input
          ref={inputRef}
          className={clsx({ 'border p-2 rounded-lg': editMode })}
          type='text'
          readOnly={!editMode}
          value={editMode ? editedContent : message.content}
          onChange={(e) => setEditedContent(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      )}
      {!!message.attachments?.length && (
        <div className='flex flex-wrap gap-1 p-2'>
          {message.attachments?.map((attachment) => (
            <img
              key={attachment.public_id}
              className='rounded-md bg-gray-100 max-h-20'
              title={attachment.file_name}
              src={attachment.thumbnail_url}
              alt={attachment.file_name}
            />
          ))}
        </div>
      )}
      <div className='flex flex-nowrap gap-2 items-center justify-end'>
        <span className='gap-2 text-xs italic font-thin inline-flex shrink-0 md:whitespace-nowrap'>
          {isMessageEdited && <CiEdit size={14} title='Was edited' />}
          {formattedDateTimeEn(updatedAt)}
        </span>

        {message.sender_id === user?.id && (
          <span>
            {message.is_read ? (
              <BiCheckDouble color='lightgreen' size={18} />
            ) : (
              <BiCheck color='darkgray' size={18} />
            )}
          </span>
        )}

        {isOwnMessage && (
          <div className='flex h-full gap-1.5 absolute right-0 top-0 group-hover/message:opacity-100 opacity-0 transition-opacity duration-300'>
            <button
              ref={saveButtonRef}
              className='size-4'
              type='button'
              title='Edit message'
              onClick={editMode ? handleFinishEditing : handleStartEditing}>
              {editMode ? <FaRegCheckCircle /> : <MdModeEditOutline />}
            </button>
            <button
              onClick={handleDeleteBtnClick}
              className='size-4'
              type='button'
              title='Delete message'>
              <MdDeleteOutline />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
