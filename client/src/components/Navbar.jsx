import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  logoutUser,
  resetSearchResults,
  resetUserState,
  searchUsers,
  selectUser,
} from '../app/features/user/userSlice';
import NavLinks from './ui/NavLinks';
import { Link } from 'react-router-dom';
import useDetectMobile from '../hooks/useDetectMobile';
import { resetChatState } from '../app/features/chats/chatSlice';
import { resetClubChatState } from '../app/features/clubChat/clubChatSlice';
import SearchWindow from './ui/SearchWindow';
import toast from 'react-hot-toast';
import { BsPersonCircle } from 'react-icons/bs';

const Navbar = () => {
  const { profilePicture } = useSelector(selectUser);
  const dispatch = useDispatch();
  const mobile = useDetectMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [windowMounted, setWindowMounted] = useState(false);
  const windowRef = useRef();
  let delay;

  const handleLogout = async () => {
    dispatch(resetUserState());
    dispatch(resetChatState());
    dispatch(resetClubChatState());
    dispatch(logoutUser());
  };

  useEffect(() => {
    delay = setTimeout(() => {
      if (searchQuery) {
        // Simulate fetching results
        const trimmedQuery = searchQuery.split(' ').join('');
        setTimeout(() => dispatch(searchUsers(trimmedQuery)), 1000);
      }
    }, 1000);

    if (!searchQuery) dispatch(resetSearchResults());

    return () => clearTimeout(delay);
  }, [searchQuery]);

  const keyDown = (e) => {
    if (e.key === 'Enter') {
      clearTimeout(delay);
      dispatch(resetSearchResults());
      const trimmedQuery = searchQuery.split(' ').join('');
      dispatch(searchUsers(trimmedQuery));
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setWindowMounted(true);
  };

  useEffect(() => {
    const handleClickOutside = async (event) => {
      const modal = document.getElementById('my_modal_3');
      if (
        windowRef.current &&
        !windowRef.current.contains(event.target) &&
        event.target.id !== 'search-input' &&
        !modal?.contains(event.target)
      ) {
        setWindowMounted(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar bg-gray-800 shadow-lg sticky top-0 z-50 max-[910px]:gap-4 max-[550px]:gap-0">
      {!mobile && (
        <div className="flex-1 max-[550px]:-ml-2">
          <Link to="/" className="btn btn-ghost text-xl text-white">
            {mobile ? 'FD' : 'FirstDay'}
          </Link>
        </div>
      )}
      <NavLinks />
      <div className="flex-1 gap-2 flex items-center justify-end">
        {/* {!mobile && ( */}
        <div className="form-control relative">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered bg-gray-800 text-gray-200 max-[550px]:-ml-4 search-input max-[900px]:w-20"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            onFocus={handleFocus}
            onKeyDown={keyDown}
            id="search-input"
            autoComplete="off"
          />
          {isFocused && (
            <SearchWindow
              searchQuery={searchQuery}
              windowMounted={windowMounted}
              setIsFocused={setIsFocused}
              windowRef={windowRef}
            />
          )}
        </div>
        {/* )} */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              {profilePicture ? (
                <img alt="Tailwind CSS Navbar component" src={profilePicture} />
              ) : (
                <BsPersonCircle
                  fill="rgb(209 213 219)"
                  className="w-full h-full"
                />
              )}
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-gray-800 rounded-box z-50 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to="/about" className="text-gray-200">
                About
              </Link>
            </li>
            <li>
              <Link to="/settings" className="text-gray-200">
                Settings
              </Link>
            </li>
            <li>
              <Link
                onClick={handleLogout}
                className="text-gray-200"
                to="/login"
              >
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
