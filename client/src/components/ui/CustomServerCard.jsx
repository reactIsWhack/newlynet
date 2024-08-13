import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../app/features/user/userSlice';
import ClubMsgCount from './ClubMsgCount';

const CustomServerCard = ({ members, serverName, tags, renderUnreadCount }) => {
  const { userId, unreadClubChats } = useSelector(selectUser);

  const inServer = members.some((member) => member._id === userId);
  const unreadChats = unreadClubChats.filter((unreadChat) =>
    chatIds.has(unreadChat._id)
  );

  return (
    <div className="bg-base-100 text-white shadow-lg rounded-lg p-4 max-w-[340px] w-full mb-3 xl:max-w-[390px]">
      <div className="flex items-center mb-3 justify-between">
        <div className="text-lg font-bold">{serverName}</div>
        <div className="text-left flex items-center gap-2">
          <div className="text-lg font-semibold">{members.length}</div>
          <div className="text-sm text-gray-400">
            {members.length === 1 ? 'Member' : 'Members'}
          </div>
        </div>
      </div>
      {/* Tags */}
      <div className="flex flex-wrap gap-2 justify-center">
        {tags.map((tag, index) => (
          <div className="badge badge-primary h-6 cursor-default" key={index}>
            # {tag}
          </div>
        ))}
      </div>

      <div className="flex-1 justify-center flex mt-5">
        {/* Members Count */}
        {inServer ? (
          <div className="relative">
            <button className="btn btn-outline min-h-11 h-11">Chat</button>
            {renderUnreadCount && unreadChats.length > 0 && (
              <ClubMsgCount unreadChats={unreadChats} />
            )}{' '}
          </div>
        ) : (
          <button className="btn btn-outline min-h-11 h-11">Join</button>
        )}
      </div>
    </div>
  );
};

export default CustomServerCard;
