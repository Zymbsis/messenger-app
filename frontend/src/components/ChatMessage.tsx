import { MdDeleteOutline, MdModeEditOutline } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';

import {
  useDeleteMessageMutation,
  useEditMessageMutation,
} from '../redux/api/apiSlice';
import { formattedDateTimeEn } from '../helpers/formatting';

import type { Message } from '../types/types';
import { useRef, useState } from 'react';
import { FaRegCheckCircle } from 'react-icons/fa';
import clsx from 'clsx';
import { isNotEmpty } from '../helpers/validation';

type Props = {
  message: Message;
  isOwnMessage: boolean;
};

const ChatMessage = ({ message, isOwnMessage }: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const saveButtonRef = useRef<HTMLButtonElement | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);

  const createdAt = new Date(message.created_at);
  const updatedAt = new Date(message.updated_at);
  const isMessageEdited = +createdAt !== +updatedAt;

  const [deleteMessage] = useDeleteMessageMutation();
  const handleDeleteMessage = () => deleteMessage(message.id);

  const [editMessage] = useEditMessageMutation();

  const handleStartEditing = () => {
    setEditMode(true);
    inputRef.current?.focus();
  };

  const handleFinishEditing = () => {
    if (isNotEmpty(editedContent) && editedContent !== message.content) {
      editMessage({
        content: editedContent,
        msgId: message.id,
      });
      setEditMode(false);
    } else handleCancelEditing();
  };

  const handleCancelEditing = () => {
    setEditedContent(message.content);
    setEditMode(false);
  };

  const handleBlur = ({
    relatedTarget,
  }: React.FocusEvent<HTMLInputElement>) => {
    if (relatedTarget !== saveButtonRef.current) handleCancelEditing();
  };

  const handleKeyDown = ({ key }: React.KeyboardEvent<HTMLInputElement>) => {
    if (key === 'Enter') {
      handleFinishEditing();
    } else if (key === 'Escape') {
      handleCancelEditing();
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type='text'
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        readOnly={!editMode}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={clsx({ 'border p-2 rounded-lg': editMode })}
      />
      <div className='flex flex-nowrap gap-4 items-center justify-end'>
        <span className='gap-2 italic text-sm inline-flex shrink-0 md:whitespace-nowrap'>
          {isMessageEdited && (
            <CiEdit style={{ height: 20 }} title='Was edited' />
          )}{' '}
          {formattedDateTimeEn(updatedAt)}
        </span>

        {isOwnMessage && (
          <div className='flex h-full gap-1.5'>
            <button
              ref={saveButtonRef}
              className='size-5'
              type='button'
              title='Edit message'
              onClick={editMode ? handleFinishEditing : handleStartEditing}>
              {editMode ? <FaRegCheckCircle /> : <MdModeEditOutline />}
            </button>
            <button
              onClick={handleDeleteMessage}
              className='size-5'
              type='button'
              title='Delete message'>
              <MdDeleteOutline />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatMessage;
