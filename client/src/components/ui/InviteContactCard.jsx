import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendServerInvite } from '../../app/features/clubChat/clubChatSlice';
import { selectPopup } from '../../app/features/popup/popupSlice';
import { FaCheck } from 'react-icons/fa6';
import { setContactInvites } from '../../app/features/user/userSlice';

const InviteContactCard = ({
  profilePicture,
  firstName,
  lastName,
  _id,
  serverInvites,
}) => {
  const dispatch = useDispatch();
  const { viewingUserData } = useSelector(selectPopup);
  console.log(serverInvites);

  const inviteUser = async (e) => {
    e.target.classList.add('disabled');
    e.target.disabled = true;
    await dispatch(
      sendServerInvite({ userId: _id, serverId: viewingUserData._id })
    ).then((res) => {
      if (!res.meta.rejectedWithValue) {
        dispatch(
          setContactInvites({ _id, invites: res.payload.serverInvites })
        );
      }
    });
  };
  const invitePending = serverInvites.some(
    (invite) =>
      invite.server === viewingUserData._id ||
      invite.server._id === viewingUserData._id
  );

  return (
    <div className="bg-base-300 rounded-lg shadow-lg flex justify-between p-3 mt-3">
      <div className="flex items-center gap-2">
        <img src={profilePicture} className="h-9 rounded-full" />
        <span>
          {firstName} {lastName}
        </span>
      </div>

      {invitePending ? (
        <div className="border border-blue-400 rounded-lg p-2 text-base flex items-center gap-1 cursor-default">
          <span className="text-blue-400">Sent</span>
          <FaCheck className="fill-blue-400" size={15} />
        </div>
      ) : (
        <button className="btn btn-primary min-h-10 h-10" onClick={inviteUser}>
          Invite
        </button>
      )}
    </div>
  );
};

export default InviteContactCard;
