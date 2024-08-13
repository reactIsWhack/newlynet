import React from 'react';

const CustomServerCard = ({ members, serverName, tags }) => {
  return (
    <div className="bg-base-100 text-white shadow-lg rounded-lg p-4 w-full mb-3">
      {/* Server Name */}
      <div className="flex items-center mb-6 justify-between">
        <div className="text-lg font-bold">{serverName}</div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <div className="badge badge-primary h-6 cursor-default" key={index}>
              # {tag}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between items-center">
        {/* Members Count */}
        <div className="text-left">
          <div className="text-sm text-gray-400">Members</div>
          <div className="text-2xl font-semibold">{members.length}</div>
        </div>

        {/* Unread Messages */}
        <div className="text-center">
          <div className="text-sm text-gray-400">Unread Messages</div>
          <div className="text-2xl font-semibold">0</div>
        </div>

        {/* Chat Button */}
        <div className="text-right">
          <button className="btn btn-outline min-h-11 h-11">Chat</button>
        </div>
      </div>
    </div>
  );
};

export default CustomServerCard;
