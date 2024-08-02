import { useState, useEffect } from 'react';
import { BsSend } from 'react-icons/bs';
import { AiOutlineLink } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { selectChats, sendMessage } from '../../app/features/chats/chatSlice';
import toast from 'react-hot-toast';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const { selectedConversation } = useSelector(selectChats);

  const handleChange = (e) => setMessage(e.target.value);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    const element = document.getElementById('message-textarea');
    element.style.height = 'auto';
    element.style.height = element.scrollHeight + 'px';
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message) {
      return toast.error('Please enter a message');
    }

    dispatch(sendMessage({ message, chatId: selectedConversation._id }));

    setMessage('');
  };

  return (
    <form className="px-4 my-3 sticky bottom-4 h-8" onSubmit={handleSubmit}>
      <div className="w-full relative flex items-center">
        <div className="absolute left-3">
          <label htmlFor="file-input">
            <AiOutlineLink cursor="pointer" size={15} />
          </label>

          <input id="file-input" type="file" hidden accept="image/*, video/*" />
        </div>
        <textarea
          id="message-textarea"
          className="border text-sm rounded-lg block w-full px-2.5 bg-gray-700 border-gray-600 text-white pl-9 pr-8 resize-none py-3 -mt-1 overflow-hidden"
          placeholder="Send a message"
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          maxLength={1000}
          rows={1}
        />
        <button
          type="submit"
          className="absolute inset-y-0 end-0 flex items-center pe-3"
        >
          <BsSend />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
