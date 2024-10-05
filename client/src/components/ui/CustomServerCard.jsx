import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  rejectServerInvite,
  removeServerInvite,
  selectUser,
} from '../../app/features/user/userSlice';
import ClubMsgCount from './ClubMsgCount';
import {
  joinClubServer,
  removeSuggestedServer,
  resetClubChatMessages,
  selectClubChat,
  setCustomServer,
} from '../../app/features/clubChat/clubChatSlice';
import { useNavigate } from 'react-router-dom';
import {
  setRenderModal,
  setViewingUserData,
} from '../../app/features/popup/popupSlice';

const CustomServerCard = ({
  members,
  serverName,
  tags,
  renderUnreadCount,
  chats,
  _id,
  sender,
  owner,
  admins,
}) => {
  const { userId, unreadClubChats, serverInvites } = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const inServer = members?.some((member) => member?._id === userId);
  const chatIds = new Set(chats?.map((chat) => chat._id));
  const unreadChats = unreadClubChats.filter((unreadChat) =>
    chatIds.has(unreadChat._id)
  );
  const isServerInvite = serverInvites.some(
    (serverInvite) => serverInvite.server?._id === _id
  );

  const resumeChat = async () => {
    dispatch(resetClubChatMessages());

    console.log(owner);
    await dispatch(
      setCustomServer({
        members,
        serverName,
        chats,
        serverId: _id,
        owner,
        admins,
        leaving: false,
      })
    );
    navigate(`/personalserver/${_id}/${chats[0]._id}`);
  };

  const joinServer = async () => {
    dispatch(joinClubServer(_id)).then(async (res) => {
      if (!res.meta.rejectedWithValue) {
        if (isServerInvite) {
          dispatch(removeServerInvite(_id));
        }

        dispatch(removeSuggestedServer(_id));
        navigate(`/personalserver/${_id}`);
      }
    });
  };

  const openUserDetails = async () => {
    await dispatch(setViewingUserData(sender));
    await dispatch(setRenderModal({ render: true, name: 'user-detail' }));
    document.getElementById('my_modal_3').showModal();
  };

  const rejectServer = async (e) => {
    e.target.classList.add('disabled');
    e.target.disabled = true;

    dispatch(rejectServerInvite(_id));
  };

  return (
    <div className="bg-base-100 text-white shadow-lg rounded-2xl p-4 max-w-[340px] w-full mb-3 xl:max-w-[460px] flex flex-col">
      <div className="flex items-center mb-3 justify-between">
        <div className="text-lg font-bold">{serverName}</div>
        <div className="text-left flex items-center gap-2">
          <div className="text-lg font-semibold">{members?.length}</div>
          <div className="text-sm text-gray-400">
            {members?.length === 1 ? 'Member' : 'Members'}
          </div>
        </div>
      </div>
      {/* Tags */}
      <div className="flex flex-wrap gap-2 justify-center">
        {tags?.map((tag, index) => (
          <div className="badge badge-primary h-6 cursor-default" key={index}>
            # {tag}
          </div>
        ))}
      </div>

      {isServerInvite && sender && (
        <span className="text-center w-full mt-4 text-sm">
          From:{' '}
          <span
            className="hover:underline cursor-pointer"
            onClick={openUserDetails}
          >
            {sender.firstName} {sender.lastName}
          </span>
        </span>
      )}
      <div className="flex-1 justify-center flex mt-5">
        {/* Members Count */}
        {inServer ? (
          <div className="relative">
            <button
              className="btn btn-outline min-h-11 h-11"
              onClick={resumeChat}
            >
              Chat
            </button>
            {renderUnreadCount && unreadChats.length > 0 && (
              <ClubMsgCount unreadChats={unreadChats} />
            )}{' '}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              className="btn btn-outline min-h-11 h-11"
              onClick={joinServer}
            >
              Join
            </button>
            {isServerInvite && (
              <button
                className="btn btn-outline btn-warning min-h-11 h-11"
                onClick={rejectServer}
              >
                Reject
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomServerCard;
