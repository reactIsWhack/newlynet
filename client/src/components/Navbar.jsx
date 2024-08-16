import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  logoutUser,
  resetUserState,
  selectUser,
} from '../app/features/user/userSlice';
import NavLinks from './ui/NavLinks';
import { Link } from 'react-router-dom';
import useDetectMobile from '../hooks/useDetectMobile';
import { resetChatState } from '../app/features/chats/chatSlice';
import { resetClubChatState } from '../app/features/clubChat/clubChatSlice';
import SearchWindow from './ui/SearchWindow';

const Navbar = () => {
  const { profilePicture } = useSelector(selectUser);
  const dispatch = useDispatch();
  const mobile = useDetectMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [windowMounted, setWindowMounted] = useState(false);

  const handleLogout = () => {
    dispatch(resetUserState());
    dispatch(resetChatState());
    dispatch(resetClubChatState());
    dispatch(logoutUser());
  };

  // Simulated fetch for search results based on query
  useEffect(() => {
    if (searchQuery) {
      // Simulate fetching results
      const trimmedQuery = searchQuery.split(' ').join('');
      console.log(trimmedQuery);
      setSearchResults(['Result 1', 'Result 2', 'Result 3', 'Result 4']);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleFocus = () => {
    setIsFocused(true);
    setWindowMounted(true);
  };

  const handleBlur = () => {
    setWindowMounted(false);
  };

  return (
    <div className="navbar bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="flex-1 max-[550px]:-ml-2">
        <Link to="/" className="btn btn-ghost text-xl text-white">
          {mobile ? 'N' : 'NewlyNet'}
        </Link>
      </div>
      <NavLinks />
      <div className="flex-1 gap-2 flex items-center justify-end">
        {!mobile && (
          <div className="form-control relative">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-24 md:w-auto bg-gray-800 text-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={handleBlur}
              onFocus={handleFocus}
            />
            {isFocused && (
              <SearchWindow
                searchResults={searchResults}
                searchQuery={searchQuery}
                windowMounted={windowMounted}
                setIsFocused={setIsFocused}
              />
            )}
          </div>
        )}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img alt="Tailwind CSS Navbar component" src={profilePicture} />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-gray-800 rounded-box z-50 mt-3 w-52 p-2 shadow"
          >
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
