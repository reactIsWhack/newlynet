import { useState, useEffect } from 'react';
import { BsSend } from 'react-icons/bs';
import { AiOutlineLink } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { selectChats, sendMessage } from '../../app/features/chats/chatSlice';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { IoIosClose } from 'react-icons/io';

const MessageInput = ({ filePreview, setFilePreview, lastMessageRef }) => {
  const [message, setMessage] = useState('');
  const [fileInput, setFileInput] = useState({ data: '', type: '' });
  const dispatch = useDispatch();
  const { selectedConversation, createMsgLoading } = useSelector(selectChats);
  const { id } = useParams();

  const handleChange = (e) => setMessage(e.target.value);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  const handleFileChange = async (e) => {
    await setFileInput({
      data: e.target.files[0],
      type: e.target.files[0].type,
    });
    const url = URL.createObjectURL(e.target.files[0]);
    setFilePreview(url);
  };

  useEffect(() => {
    const element = document.getElementById('message-textarea');
    element.style.height = 'auto';
    element.style.height = element.scrollHeight + 'px';
  }, [message]);

  useEffect(() => {
    setMessage('');
    setFilePreview('');
    setFileInput('');
    const element = document.getElementById('file-input');
    if (element) element.value = null;
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(message);
    const formData = new FormData();
    formData.append('message', message);
    formData.append('image', fileInput.data);

    if (!message) {
      return toast.error('Please enter a message', { id: 'msg-warning' });
    }

    dispatch(sendMessage({ formData, chatId: selectedConversation._id })).then(
      (res) => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    );

    setMessage('');
    setFilePreview('');
  };

  const resetFiles = () => {
    setFileInput('');
    setFilePreview('');
    document.getElementById('file-input').value = null;
  };

  return (
    <form
      className={`px-4 my-3 sticky rounded-lg pt-3 ${
        filePreview ? 'border border-slate-200 mx-4 pb-3' : ''
      }`}
      onSubmit={handleSubmit}
    >
      {filePreview && (
        <div className="mb-3 w-1/3 rounded-lg h-48 relative flex items-center max-[550px]:w-full max-[550px]:h-44">
          <IoIosClose
            size={30}
            onClick={resetFiles}
            className={`absolute right-2 z-40 text-slate-600 top-2`}
            cursor="pointer"
          />
          {fileInput.type.includes('video') ? (
            <video
              src={filePreview}
              controls
              className="rounded-lg h-full object-cover w-full"
            ></video>
          ) : (
            <img
              src={filePreview}
              className="w-full h-full object-cover rounded-lg"
              alt="Preview"
            />
          )}
        </div>
      )}
      <div className="w-full relative flex items-center">
        <div className="absolute left-3">
          <label htmlFor="file-input">
            <AiOutlineLink cursor="pointer" size={15} />
          </label>
          <input
            id="file-input"
            type="file"
            hidden
            accept="image/*, video/*"
            onChange={handleFileChange}
          />
        </div>
        <div className="w-full">
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
        </div>
        {createMsgLoading ? (
          <span className="loading loading-spinner loading-sm absolute inset-y-0 right-4 flex items-center pe-3 disabled"></span>
        ) : (
          <button
            type="submit"
            className="absolute inset-y-0 end-0 flex items-center pe-3"
          >
            <BsSend />
          </button>
        )}
      </div>
    </form>
  );
};

export default MessageInput;
