import React from 'react';

const CustomServerCard = ({ members, serverName }) => {
  return (
    <div className="stats shadow h-28 w-full overflow-hidden flex my-5">
      <div className="stat max-w-32 px-4 flex-1 xl:max-w-40">
        <div className="stat-title">Members</div>
        <div className="stat-value text-3xl">{members.length}</div>
        <div className="stat-desc"></div>
      </div>

      <div className="stat max-w-32 px-4 flex-1 xl:max-w-40">
        <div className="stat-title text-center w-full text-slate-400 font-semibold">
          {serverName}
        </div>
        <button className="btn btn-primary h-9 min-h-9 mt-3">Chat</button>
      </div>

      <div className="stat max-w-32 px-4 flex-1 xl:max-w-40">
        <div className="stat-title text-right w-full ">Unread Msg</div>
        <div className="stat-value text-3xl text-right w-full">0</div>
      </div>
    </div>
  );
};

export default CustomServerCard;
